import { asyncMap } from 'convex-helpers'
import { internalAction, internalMutation } from '@cvx/_generated/server'
import { Currency, Interval, PlanKey, planKeyValidator } from '@cvx/schema'
import { v } from 'convex/values'
import { internal } from '@cvx/_generated/api'
import { ERRORS } from '@cvx/errors'
import { stripe } from '@cvx/stripe'

const seedProducts = [
  {
    key: 'free',
    name: 'Free',
    description: 'Start with the basics, upgrade anytime.',
    prices: {
      month: {
        usd: 0,
        eur: 0,
      },
      year: {
        usd: 0,
        eur: 0,
      },
    },
  },
  {
    key: 'pro',
    name: 'Pro',
    description: 'Access to all features and unlimited projects.',
    prices: {
      month: {
        usd: 1990,
        eur: 1990,
      },
      year: {
        usd: 19990,
        eur: 19990,
      },
    },
  },
]

export const insertSeedPlan = internalMutation({
  args: {
    stripeId: v.string(),
    key: planKeyValidator,
    name: v.string(),
    description: v.string(),
    prices: v.object({
      month: v.object({
        usd: v.object({
          stripeId: v.string(),
          amount: v.number(),
        }),
        eur: v.object({
          stripeId: v.string(),
          amount: v.number(),
        }),
      }),
      year: v.object({
        usd: v.object({
          stripeId: v.string(),
          amount: v.number(),
        }),
        eur: v.object({
          stripeId: v.string(),
          amount: v.number(),
        }),
      }),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('plans', {
      stripeId: args.stripeId,
      key: args.key,
      name: args.name,
      description: args.description,
      prices: args.prices,
    })
  },
})

export default internalAction(async (ctx) => {
  /**
   * Stripe Products.
   */
  const products = await stripe.products.list({
    limit: 1,
  })
  if (products?.data?.length) {
    console.info('🏃‍♂️ Skipping Stripe products creation and seeding.')
    return true
  }

  const seededProducts = await asyncMap(seedProducts, async (product) => {
    // Format prices to match Stripe's API.
    const pricesByInterval = Object.entries(product.prices).flatMap(
      ([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }))
      },
    )

    // Create Stripe product.
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
    })

    // Create Stripe price for the current product.
    const stripePrices = await Promise.all(
      pricesByInterval.map((price) => {
        return stripe.prices.create({
          product: stripeProduct.id,
          currency: price.currency ?? 'usd',
          unit_amount: price.amount ?? 0,
          tax_behavior: 'inclusive',
          recurring: {
            interval: (price.interval as 'month' | 'year') ?? 'month',
          },
        })
      }),
    )

    const getPrice = (currency: Currency, interval: Interval) => {
      const price = stripePrices.find(
        (price) =>
          price.currency === currency && price.recurring?.interval === interval,
      )
      if (!price) {
        throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
      }
      return { stripeId: price.id, amount: price.unit_amount || 0 }
    }

    await ctx.runMutation(internal.init.insertSeedPlan, {
      stripeId: stripeProduct.id,
      key: product.key as PlanKey,
      name: product.name,
      description: product.description,
      prices: {
        month: {
          usd: getPrice('usd', 'month'),
          eur: getPrice('eur', 'month'),
        },
        year: {
          usd: getPrice('usd', 'year'),
          eur: getPrice('eur', 'year'),
        },
      },
    })

    return {
      product: stripeProduct.id,
      prices: stripePrices.map((price) => price.id),
    }
  })
  console.info(`📦 Stripe Products has been successfully created.`)

  // Configure Customer Portal.
  await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'Organization Name - Customer Portal',
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['address', 'shipping', 'tax_id', 'email'],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        proration_behavior: 'always_invoice',
        products: seededProducts.filter(({ product }) => product !== 'free'),
      },
    },
  })

  console.info(`👒 Stripe Customer Portal has been successfully configured.`)
  console.info(
    '🎉 Visit: https://dashboard.stripe.com/test/products to see your products.',
  )
})
