import { internal } from '@cvx/_generated/api'
import { Id } from '@cvx/_generated/dataModel'
import { mutation, query } from '@cvx/_generated/server'
import { auth } from '@cvx/auth'
import { asyncMap } from 'convex-helpers'
import { v } from 'convex/values'

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    const [user, subscription] = await Promise.all([
      ctx.db.get(userId),
      ctx.db
        .query('subscriptions')
        .withIndex('userId', (q) => q.eq('userId', userId))
        .unique(),
    ])
    if (!user) {
      return
    }
    const avatarUrl =
      user.image ||
      (user.imageId ? await ctx.storage.getUrl(user.imageId) : undefined)
    return {
      ...user,
      avatarUrl: avatarUrl || undefined,
      subscription,
    }
  },
})

export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    await ctx.db.patch(userId, { username: args.username })
  },
})

export const onboardingUpdateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(0)
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      console.log(1)
      return
    }
    const user = await ctx.db.get(userId)
    if (!user) {
      console.log(2)
      return
    }
    await ctx.db.patch(userId, { username: args.username })
    console.log('patched', userId, args.username)
    if (user.customerId) {
      return
    }
    await ctx.scheduler.runAfter(0, internal.stripe.createStripeCustomer, {
      userId,
    })
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      throw new Error('User not found')
    }
    return await ctx.storage.generateUploadUrl()
  },
})

export const updateUserImage = mutation({
  args: {
    imageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    ctx.db.patch(userId, { imageId: args.imageId })
  },
})

export const removeUserImage = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    ctx.db.patch(userId, { imageId: undefined, image: undefined })
  },
})

export const getActivePlans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    const [free, pro] = await asyncMap(['free', 'pro'] as const, (key) =>
      ctx.db
        .query('plans')
        .withIndex('key', (q) => q.eq('key', key))
        .unique(),
    )
    if (!free || !pro) {
      throw new Error('Plan not found')
    }
    return { free, pro }
  },
})
