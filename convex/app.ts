import { mutation, query } from '@cvx/_generated/server'
import { auth } from '@cvx/auth'
import { v } from 'convex/values'

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) {
      return
    }
    const user = await ctx.db.get(userId)
    if (!user) {
      return
    }
    const avatarUrl = user.imageId ? await ctx.storage.getUrl(user.imageId) : undefined
    return { ...user, email: user.email || '', username: user.username || '', planId: user.planId || '', avatarUrl }
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
