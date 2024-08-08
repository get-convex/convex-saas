import Stripe from 'stripe'
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
} from '@cvx/_generated/server'
import { v } from 'convex/values'
import { auth } from '@cvx/auth'
import { ERRORS } from '~/constants/errors'
import { currencyValidator, intervalValidator } from '@cvx/schema'
import { api, internal } from '~/convex/_generated/api'
import { HOST_URL } from '~/constants/env'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED})`)
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

/**
 * Creates a Stripe customer for a user.
 */
export const updateCustomerId = internalMutation({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    await ctx.db.patch(userId, { customerId: args.customerId })
  },
})

export const createStripeCustomer = internalAction({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.app.getCurrentUser)
    if (!user || user.customerId)
      throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)

    const customer = await stripe.customers
      .create({ email: user.email, name: user.username })
      .catch((err) => console.error(err))
    if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)

    await ctx.runMutation(internal.stripe.updateCustomerId, {
      customerId: customer.id,
    })
  },
})

export const getCurrentUserSubscription = internalQuery({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .unique()
    if (!subscription) {
      return
    }
    const plan = await ctx.db.get(subscription.planId)
    return {
      ...subscription,
      plan,
    }
  },
})

export const getDefaultPlan = internalQuery({
  handler: async (ctx) => {
    return ctx.db
      .query('plans')
      .withIndex('key', (q) => q.eq('key', 'free'))
      .unique()
  },
})

export const createSubscription = internalMutation({
  args: {
    planId: v.id('plans'),
    currency: currencyValidator,
    stripeSubscriptionId: v.string(),
    status: v.string(),
    interval: intervalValidator,
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    const subscription = await ctx.db.get(userId)
    if (subscription) {
      throw new Error('Subscription already exists')
    }
    await ctx.db.insert('subscriptions', {
      userId,
      planId: args.planId,
      stripeId: args.stripeSubscriptionId,
      currency: args.currency,
      interval: args.interval,
      status: args.status,
      currentPeriodStart: args.currentPeriodStart,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
    })
  },
})

/**
 * Creates a Stripe free tier subscription for a user.
 */
export const createFreeStripeSubscription = action({
  args: {
    currency: v.union(v.literal('usd'), v.literal('eur')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.app.getCurrentUser)
    if (!user || !user.customerId) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }

    const subscription = await ctx.runQuery(
      internal.stripe.getCurrentUserSubscription,
    )
    if (subscription) {
      return false
    }

    const plan = await ctx.runQuery(internal.stripe.getDefaultPlan)
    if (!plan) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }

    const yearlyPrice = plan.prices.year[args.currency]

    const stripeSubscription = await stripe.subscriptions.create({
      customer: String(user.customerId),
      items: [{ price: yearlyPrice?.stripeId }],
    })
    if (!stripeSubscription) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }
    await ctx.runMutation(internal.stripe.createSubscription, {
      planId: plan._id,
      currency: args.currency,
      stripeSubscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
      interval: 'year',
      currentPeriodStart: stripeSubscription.current_period_start,
      currentPeriodEnd: stripeSubscription.current_period_end,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    })
  },
})

/**
 * Creates a Stripe checkout session for a user.
 */
export const createSubscriptionCheckout = action({
  args: {
    userId: v.id('users'),
    planId: v.id('plans'),
    planInterval: intervalValidator,
    currency: currencyValidator,
  },
  handler: async (ctx, args): Promise<string | undefined> => {
    const user = await ctx.runQuery(api.app.getCurrentUser)
    if (!user || !user.customerId) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }

    const currentSubscription = await ctx.runQuery(
      internal.stripe.getCurrentUserSubscription,
    )
    if (!currentSubscription?.plan) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }
    if (currentSubscription.plan.stripeId !== 'free') {
      return
    }
    const price =
      currentSubscription.plan.prices[args.planInterval][args.currency]

    const checkout = await stripe.checkout.sessions.create({
      customer: user.customerId,
      line_items: [{ price: price.stripeId, quantity: 1 }],
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${HOST_URL}/dashboard/checkout`,
      cancel_url: `${HOST_URL}/dashboard/settings/billing`,
    })
    if (!checkout) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }
    return checkout.url || undefined
  },
})

/**
 * Creates a Stripe customer portal for a user.
 */
export const createCustomerPortal = action({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    const user = await ctx.runQuery(api.app.getCurrentUser)
    if (!user || !user.customerId) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }

    const customerPortal = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: `${HOST_URL}/dashboard/settings/billing`,
    })
    if (!customerPortal) {
      throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    }
    return customerPortal.url
  },
})
