import { convexQuery } from '@convex-dev/react-query'
import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Helmet } from 'react-helmet-async'
import { api } from '~/convex/_generated/api'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  isAuthenticated: boolean
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
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.app.getCurrentUser, {}),
    )
  },
})
