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
    const { email } = user
    if (!email) {
      return
    }
    return { ...user, email, username: user.username ?? '', planId: user.planId ?? '' }
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
