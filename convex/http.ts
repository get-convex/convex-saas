import { httpRouter } from 'convex/server'
import { auth } from './auth'
import { httpAction } from '@cvx/_generated/server'
import { ERRORS } from '@cvx/errors'
import { stripe } from '@cvx/stripe'
import { STRIPE_WEBHOOK_SECRET } from '@cvx/env'
import { z } from 'zod'
import { internal } from '@cvx/_generated/api'
import { Interval } from '@cvx/schema'

const http = httpRouter()

/**
 * Gets and constructs a Stripe event signature.
 *
 * @throws An error if Stripe signature is missing or if event construction fails.
 * @returns The Stripe event object.
 */
async function getStripeEvent(request: Request) {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED}`)
  }

  try {
    const signature = request.headers.get('Stripe-Signature')
    if (!signature) throw new Error(ERRORS.STRIPE_MISSING_SIGNATURE)
    const payload = await request.text()
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )
    return event
  } catch (err: unknown) {
    console.log(err)
    throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
  }
}

http.route({
  path: '/stripe/webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const event = await getStripeEvent(request)

    try {
      switch (event.type) {
        /**
         * Occurs when a Checkout Session has been successfully completed.
         */
        case 'checkout.session.completed': {
          const session = event.data.object

          const { customer: customerId, subscription: subscriptionId } = z
            .object({ customer: z.string(), subscription: z.string() })
            .parse(session)

          const user = await ctx.runQuery(
            internal.stripe.PREAUTH_getUserByCustomerId,
            {
              customerId,
            },
          )
          if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG)

          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId)

          await ctx.runMutation(internal.stripe.PREAUTH_updateSubscription, {
            userId: user._id,
            subscriptionStripeId: subscription.id,
            input: {
              planStripeId: String(subscription.items.data[0].plan.product),
              priceStripeId: String(subscription.items.data[0].price.id),
              interval: String(
                subscription.items.data[0].plan.interval,
              ) as Interval,
              status: subscription.status,
              currentPeriodStart: subscription.current_period_start,
              currentPeriodEnd: subscription.current_period_end,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          })

          await sendSubscriptionSuccessEmail({
            email: user.email,
            subscriptionId,
          })

          // Cancel free subscription. — User upgraded to a paid plan.
          // Not required, but it's a good practice to keep just a single active plan.
          const subscriptions = (
            await stripe.subscriptions.list({ customer: customerId })
          ).data.map((sub) => sub.items)

          if (subscriptions.length > 1) {
            const freeSubscription = subscriptions.find((sub) =>
              sub.data.some((item) => item.price.product === PLANS.FREE),
            )
            if (freeSubscription) {
              await stripe.subscriptions.cancel(
                freeSubscription?.data[0].subscription,
              )
            }
          }

          return new Response(null)
        }

        /**
         * Occurs when a Stripe subscription has been updated.
         * E.g. when a user upgrades or downgrades their plan.
         */
        case 'customer.subscription.updated': {
          const subscription = event.data.object
          const { customer: customerId } = z
            .object({ customer: z.string() })
            .parse(subscription)

          const user = await prisma.user.findUnique({ where: { customerId } })
          if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG)

          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              id: subscription.id,
              userId: user.id,
              planId: String(subscription.items.data[0].plan.product),
              priceId: String(subscription.items.data[0].price.id),
              interval: String(subscription.items.data[0].plan.interval),
              status: subscription.status,
              currentPeriodStart: subscription.current_period_start,
              currentPeriodEnd: subscription.current_period_end,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          })

          return new Response(null)
        }

        /**
         * Occurs whenever a customer’s subscription ends.
         */
        case 'customer.subscription.deleted': {
          const subscription = event.data.object
          const { id } = z.object({ id: z.string() }).parse(subscription)

          const dbSubscription = await prisma.subscription.findUnique({
            where: { id },
          })
          if (dbSubscription)
            await prisma.subscription.delete({
              where: { id: dbSubscription.id },
            })

          return new Response(null)
        }
      }
    } catch (err: unknown) {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object

          const { customer: customerId, subscription: subscriptionId } = z
            .object({ customer: z.string(), subscription: z.string() })
            .parse(session)

          const user = await prisma.user.findUnique({ where: { customerId } })
          if (!user) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

          await sendSubscriptionErrorEmail({
            email: user.email,
            subscriptionId,
          })
          return new Response(null)
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object

          const { id: subscriptionId, customer: customerId } = z
            .object({ id: z.string(), customer: z.string() })
            .parse(subscription)

          const user = await prisma.user.findUnique({ where: { customerId } })
          if (!user) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

          await sendSubscriptionErrorEmail({
            email: user.email,
            subscriptionId,
          })
          return new Response(null)
        }
      }

      throw err
    }

    return new Response(null)
  }),
})

auth.addHttpRoutes(http)

export default http
