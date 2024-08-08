import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useLoaderData,
  useNavigate,
  useRouteContext,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConvexAuthState } from 'convex/react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Route as DashboardRoute } from './dashboard/_layout'
import { Route as AuthLoginRoute } from './auth/_layout.login'
import { Doc } from '~/convex/_generated/dataModel'

export const Route = createRootRouteWithContext<{
  auth: ConvexAuthState
  user: Doc<'users'>
  queryClient: QueryClient
}>()({
  component: () => {
    const router = useRouter()
    const data = useLoaderData({ from: '/' })
    console.log('data', data)
    const navigate = useNavigate()
    useEffect(() => {
      if (!data.user) {
        navigate({ to: AuthLoginRoute.fullPath })
      }
      if (data.user) {
        navigate({ to: DashboardRoute.fullPath })
      }
    }, [data.user])
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
