import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useRouteContext,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConvexAuthState } from 'convex/react'
import { Helmet } from 'react-helmet-async'
import type { User } from '~/types'

export const Route = createRootRouteWithContext<{
  auth: ConvexAuthState
  user: User
  queryClient: QueryClient
}>()({
  component: () => {
    const router = useRouter()
    const routeContext = useRouteContext({
      from: router.state.matches.slice(-1)[0].id,
    })
    console.log('context', routeContext)
    const matchWithTitle = [...router.state.matches]
      .reverse()
      .find((d) => d.routeContext?.title)
    const title = matchWithTitle?.routeContext.title || 'Convex SaaS'

    return (
      <>
        <Outlet />
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <TanStackRouterDevtools />
      </>
    )
  },
})
