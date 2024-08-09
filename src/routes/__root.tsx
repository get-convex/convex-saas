import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConvexAuthState } from 'convex/react'
import { Helmet } from 'react-helmet-async'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  authState: ConvexAuthState
}>()({
  component: () => {
    const router = useRouter()
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
