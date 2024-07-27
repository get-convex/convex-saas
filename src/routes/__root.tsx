import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConvexAuthState } from 'convex/react'
import type { User } from '~/types'

export const Route = createRootRouteWithContext<{ auth: ConvexAuthState, user: User, queryClient: QueryClient }>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
