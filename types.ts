import { Doc } from '~/convex/_generated/dataModel'

export type User = Doc<'users'> & {
  avatarUrl?: string
  subscription?: Doc<'subscriptions'>
}
