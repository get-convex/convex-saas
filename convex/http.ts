import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { ActionCtx, httpAction } from "@cvx/_generated/server";
import { ERRORS } from "~/errors";
import { stripe } from "@cvx/stripe";
import { STRIPE_WEBHOOK_SECRET } from "@cvx/env";
import { z } from "zod";
import { internal } from "@cvx/_generated/api";
import { Currency, Interval, PLANS } from "@cvx/schema";
import {
  sendSubscriptionErrorEmail,
  sendSubscriptionSuccessEmail,
} from "@cvx/email/templates/subscriptionEmail";
import Stripe from "stripe";
import { Doc } from "@cvx/_generated/dataModel";

const http = httpRouter();

/**
 * Gets and constructs a Stripe event signature.
 *
 * @throws An error if Stripe signature is missing or if event construction fails.
 * @returns The Stripe event object.
 */
async function getStripeEvent(request: Request) {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED}`);
  }

  try {
    const signature = request.headers.get("Stripe-Signature");
    if (!signature) throw new Error(ERRORS.STRIPE_MISSING_SIGNATURE);
    const payload = await request.text();
    const event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
    return event;
  } catch (err: unknown) {
    console.log(err);
    throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  }
}

const handleUpdateSubscription = async (
  ctx: ActionCtx,
  user: Doc<"users">,
  subscription: Stripe.Subscription,
) => {
  const subscriptionItem = subscription.items.data[0];
  await ctx.runMutation(internal.stripe.PREAUTH_replaceSubscription, {
    userId: user._id,
    subscriptionStripeId: subscription.id,
    input: {
      currency: subscription.items.data[0].price.currency as Currency,
      planStripeId: subscriptionItem.plan.product as string,
      priceStripeId: subscriptionItem.price.id,
      interval: subscriptionItem.plan.interval as Interval,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
};

const handleCheckoutSessionCompleted = async (
  ctx: ActionCtx,
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  const session = event.data.object;

  const { customer: customerId, subscription: subscriptionId } = z
    .object({ customer: z.string(), subscription: z.string() })
    .parse(session);

  const user = await ctx.runQuery(internal.stripe.PREAUTH_getUserByCustomerId, {
    customerId,
  });
  if (!user?.email) {
    throw new Error(ERRORS.SOMETHING_WENT_WRONG);
  }

  const freeSubscriptionStripeId =
    user.subscription.planKey === PLANS.FREE
      ? user.subscription.stripeId
      : undefined;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await handleUpdateSubscription(ctx, user, subscription);

  await sendSubscriptionSuccessEmail({
    email: user.email,
    subscriptionId,
  });

  // Cancel free subscription. — User upgraded to a paid plan.
  // Not required, but it's a good practice to keep just a single active plan.
  const subscriptions = (
    await stripe.subscriptions.list({ customer: customerId })
  ).data.map((sub) => sub.items);

  if (subscriptions.length > 1) {
    const freeSubscription = subscriptions.find((sub) =>
      sub.data.some(
        ({ subscription }) => subscription === freeSubscriptionStripeId,
      ),
    );
    if (freeSubscription) {
      await stripe.subscriptions.cancel(freeSubscription?.data[0].subscription);
    }
  }

  return new Response(null);
};

const handleCheckoutSessionCompletedError = async (
  ctx: ActionCtx,
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  const session = event.data.object;

  const { customer: customerId, subscription: subscriptionId } = z
    .object({ customer: z.string(), subscription: z.string() })
    .parse(session);

  const user = await ctx.runQuery(internal.stripe.PREAUTH_getUserByCustomerId, {
    customerId,
  });
  if (!user?.email) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

  await sendSubscriptionErrorEmail({
    email: user.email,
    subscriptionId,
  });
  return new Response(null);
};

const handleCustomerSubscriptionUpdated = async (
  ctx: ActionCtx,
  event: Stripe.CustomerSubscriptionUpdatedEvent,
) => {
  const subscription = event.data.object;
  const { customer: customerId } = z
    .object({ customer: z.string() })
    .parse(subscription);

  const user = await ctx.runQuery(internal.stripe.PREAUTH_getUserByCustomerId, {
    customerId,
  });
  if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG);

  await handleUpdateSubscription(ctx, user, subscription);

  return new Response(null);
};

const handleCustomerSubscriptionUpdatedError = async (
  ctx: ActionCtx,
  event: Stripe.CustomerSubscriptionUpdatedEvent,
) => {
  const subscription = event.data.object;

  const { id: subscriptionId, customer: customerId } = z
    .object({ id: z.string(), customer: z.string() })
    .parse(subscription);

  const user = await ctx.runQuery(internal.stripe.PREAUTH_getUserByCustomerId, {
    customerId,
  });
  if (!user?.email) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

  await sendSubscriptionErrorEmail({
    email: user.email,
    subscriptionId,
  });
  return new Response(null);
};

const handleCustomerSubscriptionDeleted = async (
  ctx: ActionCtx,
  event: Stripe.CustomerSubscriptionDeletedEvent,
) => {
  const subscription = event.data.object;
  await ctx.runMutation(internal.stripe.PREAUTH_deleteSubscription, {
    subscriptionStripeId: subscription.id,
  });
  return new Response(null);
};

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await getStripeEvent(request);

    try {
      switch (event.type) {
        /**
         * Occurs when a Checkout Session has been successfully completed.
         */
        case "checkout.session.completed": {
          return handleCheckoutSessionCompleted(ctx, event);
        }

        /**
         * Occurs when a Stripe subscription has been updated.
         * E.g. when a user upgrades or downgrades their plan.
         */
        case "customer.subscription.updated": {
          return handleCustomerSubscriptionUpdated(ctx, event);
        }

        /**
         * Occurs whenever a customer’s subscription ends.
         */
        case "customer.subscription.deleted": {
          return handleCustomerSubscriptionDeleted(ctx, event);
        }
      }
    } catch (err: unknown) {
      switch (event.type) {
        case "checkout.session.completed": {
          return handleCheckoutSessionCompletedError(ctx, event);
        }

        case "customer.subscription.updated": {
          return handleCustomerSubscriptionUpdatedError(ctx, event);
        }
      }

      throw err;
    }

    return new Response(null);
  }),
});

auth.addHttpRoutes(http);

export default http;
