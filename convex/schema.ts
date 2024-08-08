import { defineSchema, defineTable } from 'convex/server'
import { authTables } from '@convex-dev/auth/server'
import { v, Infer } from 'convex/values'

export const currencyValidator = v.union(v.literal('usd'), v.literal('eur'))
export type Currency = Infer<typeof currencyValidator>
export const intervalValidator = v.union(v.literal('month'), v.literal('year'))
export type Interval = Infer<typeof intervalValidator>
export const planKeyValidator = v.union(v.literal('free'), v.literal('pro'))
export type PlanKey = Infer<typeof planKeyValidator>

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageId: v.optional(v.id('_storage')),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    customerId: v.optional(v.string()),
  })
    .index('email', ['email'])
    .index('customerId', ['customerId']),
  plans: defineTable({
    key: planKeyValidator,
    stripeId: v.string(),
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
  })
    .index('key', ['key'])
    .index('stripeId', ['stripeId']),
  subscriptions: defineTable({
    userId: v.id('users'),
    planId: v.id('plans'),
    priceStripeId: v.string(),
    stripeId: v.string(),
    currency: currencyValidator,
    interval: intervalValidator,
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  }).index('userId', ['userId']),
})

export default schema
