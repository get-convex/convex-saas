import { mutation } from '@cvx/_generated/server'

export default mutation(async (ctx) => {
  const user = await ctx.db.query('users').unique()
  if (!user) {
    throw new Error('User not found')
  }
  await ctx.db.patch(user._id, { customerId: undefined, username: undefined })
  const subscription = await ctx.db.query('subscriptions').unique()
  if (!subscription) {
    throw new Error('Subscription not found')
  }
  await ctx.db.delete(subscription._id)
})
