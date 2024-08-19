import Stripe from "stripe";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
} from "@cvx/_generated/server";
import { v } from "convex/values";
import { ERRORS } from "~/errors";
import { auth } from "@cvx/auth";
import { currencyValidator, intervalValidator, PLANS } from "@cvx/schema";
import { api, internal } from "~/convex/_generated/api";
import { SITE_URL, STRIPE_SECRET_KEY } from "@cvx/env";
import { asyncMap } from "convex-helpers";

/**
 * TODO: Uncomment to require Stripe keys.
 * Also remove the `|| ''` from the Stripe constructor.
 */
/*
if (!STRIPE_SECRET_KEY) {
  throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED})`)
}
*/

export const stripe = new Stripe(STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

/**
 * The following functions are prefixed 'PREAUTH' or 'UNAUTH' because they are
 * used as scheduled functions and do not have a currently authenticated user to
 * reference. PREAUTH means a user id is passed in, and must be authorized prior
 * to scheduling the function. UNAUTH means authorization is not required.
 *
 * All PREAUTH and UNAUTH functions should be internal.
 *
 * Note: this is an arbitrary naming convention, feel free to change or remove.
 */

/**
 * Creates a Stripe customer for a user.
 */
export const PREAUTH_updateCustomerId = internalMutation({
  args: {
    userId: v.id("users"),
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { customerId: args.customerId });
  },
});

export const PREAUTH_getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});

export const PREAUTH_createStripeCustomer = internalAction({
  args: {
    currency: currencyValidator,
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.stripe.PREAUTH_getUserById, {
      userId: args.userId,
    });
    if (!user || user.customerId)
      throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);

    const customer = await stripe.customers
      .create({ email: user.email, name: user.username })
      .catch((err) => console.error(err));
    if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);

    await ctx.runAction(internal.stripe.PREAUTH_createFreeStripeSubscription, {
      userId: args.userId,
      customerId: customer.id,
      currency: args.currency,
    });
  },
});

export const UNAUTH_getDefaultPlan = internalQuery({
  handler: async (ctx) => {
    return ctx.db
      .query("plans")
      .withIndex("key", (q) => q.eq("key", PLANS.FREE))
      .unique();
  },
});

export const PREAUTH_getUserByCustomerId = internalQuery({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("customerId", (q) => q.eq("customerId", args.customerId))
      .unique();
    if (!user) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .unique();
    if (!subscription) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    const plan = await ctx.db.get(subscription.planId);
    if (!plan) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    return {
      ...user,
      subscription: {
        ...subscription,
        planKey: plan.key,
      },
    };
  },
});

export const PREAUTH_createSubscription = internalMutation({
  args: {
    userId: v.id("users"),
    planId: v.id("plans"),
    priceStripeId: v.string(),
    currency: currencyValidator,
    stripeSubscriptionId: v.string(),
    status: v.string(),
    interval: intervalValidator,
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (subscription) {
      throw new Error("Subscription already exists");
    }
    await ctx.db.insert("subscriptions", {
      userId: args.userId,
      planId: args.planId,
      priceStripeId: args.priceStripeId,
      stripeId: args.stripeSubscriptionId,
      currency: args.currency,
      interval: args.interval,
      status: args.status,
      currentPeriodStart: args.currentPeriodStart,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
    });
  },
});

export const PREAUTH_replaceSubscription = internalMutation({
  args: {
    userId: v.id("users"),
    subscriptionStripeId: v.string(),
    input: v.object({
      currency: currencyValidator,
      planStripeId: v.string(),
      priceStripeId: v.string(),
      interval: intervalValidator,
      status: v.string(),
      currentPeriodStart: v.number(),
      currentPeriodEnd: v.number(),
      cancelAtPeriodEnd: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!subscription) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    await ctx.db.delete(subscription._id);
    const plan = await ctx.db
      .query("plans")
      .withIndex("stripeId", (q) => q.eq("stripeId", args.input.planStripeId))
      .unique();
    if (!plan) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    await ctx.db.insert("subscriptions", {
      userId: args.userId,
      planId: plan._id,
      stripeId: args.subscriptionStripeId,
      priceStripeId: args.input.priceStripeId,
      interval: args.input.interval,
      status: args.input.status,
      currency: args.input.currency,
      currentPeriodStart: args.input.currentPeriodStart,
      currentPeriodEnd: args.input.currentPeriodEnd,
      cancelAtPeriodEnd: args.input.cancelAtPeriodEnd,
    });
  },
});

export const PREAUTH_deleteSubscription = internalMutation({
  args: {
    subscriptionStripeId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("stripeId", (q) => q.eq("stripeId", args.subscriptionStripeId))
      .unique();
    if (!subscription) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    await ctx.db.delete(subscription._id);
  },
});

/**
 * Creates a Stripe free tier subscription for a user.
 */
export const PREAUTH_createFreeStripeSubscription = internalAction({
  args: {
    userId: v.id("users"),
    customerId: v.string(),
    currency: currencyValidator,
  },
  handler: async (ctx, args) => {
    const plan = await ctx.runQuery(internal.stripe.UNAUTH_getDefaultPlan);
    if (!plan) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }

    const yearlyPrice = plan.prices.year[args.currency];

    const stripeSubscription = await stripe.subscriptions.create({
      customer: args.customerId,
      items: [{ price: yearlyPrice?.stripeId }],
    });
    if (!stripeSubscription) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    await ctx.runMutation(internal.stripe.PREAUTH_createSubscription, {
      userId: args.userId,
      planId: plan._id,
      currency: args.currency,
      priceStripeId: stripeSubscription.items.data[0].price.id,
      stripeSubscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
      interval: "year",
      currentPeriodStart: stripeSubscription.current_period_start,
      currentPeriodEnd: stripeSubscription.current_period_end,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    });

    await ctx.runMutation(internal.stripe.PREAUTH_updateCustomerId, {
      userId: args.userId,
      customerId: args.customerId,
    });
  },
});

export const getCurrentUserSubscription = internalQuery({
  args: {
    planId: v.id("plans"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    const [currentSubscription, newPlan] = await Promise.all([
      ctx.db
        .query("subscriptions")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .unique(),
      ctx.db.get(args.planId),
    ]);
    if (!currentSubscription) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    const currentPlan = await ctx.db.get(currentSubscription.planId);
    return {
      currentSubscription: {
        ...currentSubscription,
        plan: currentPlan,
      },
      newPlan,
    };
  },
});

/**
 * Creates a Stripe checkout session for a user.
 */
export const createSubscriptionCheckout = action({
  args: {
    userId: v.id("users"),
    planId: v.id("plans"),
    planInterval: intervalValidator,
    currency: currencyValidator,
  },
  handler: async (ctx, args): Promise<string | undefined> => {
    const user = await ctx.runQuery(api.app.getCurrentUser);
    if (!user || !user.customerId) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }

    const { currentSubscription, newPlan } = await ctx.runQuery(
      internal.stripe.getCurrentUserSubscription,
      { planId: args.planId },
    );
    if (!currentSubscription?.plan) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    if (currentSubscription.plan.key !== PLANS.FREE) {
      return;
    }

    const price = newPlan?.prices[args.planInterval][args.currency];

    const checkout = await stripe.checkout.sessions.create({
      customer: user.customerId,
      line_items: [{ price: price?.stripeId, quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${SITE_URL}/dashboard/checkout`,
      cancel_url: `${SITE_URL}/dashboard/settings/billing`,
    });
    if (!checkout) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    return checkout.url || undefined;
  },
});

/**
 * Creates a Stripe customer portal for a user.
 */
export const createCustomerPortal = action({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.runQuery(api.app.getCurrentUser);
    if (!user || !user.customerId) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }

    const customerPortal = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: `${SITE_URL}/dashboard/settings/billing`,
    });
    if (!customerPortal) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    return customerPortal.url;
  },
});

export const cancelCurrentUserSubscriptions = internalAction({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.app.getCurrentUser);
    if (!user) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
    }
    const subscriptions = (
      await stripe.subscriptions.list({ customer: user.customerId })
    ).data.map((sub) => sub.items);

    await asyncMap(subscriptions, async (subscription) => {
      await stripe.subscriptions.cancel(subscription.data[0].subscription);
    });
  },
});
