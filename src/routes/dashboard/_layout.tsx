import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Navigation } from '@/ui/navigation'
import { Header } from '@/ui/header'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/convex/_generated/api'

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
    if (!context.user.username) {
      throw redirect({ to: '/dashboard/onboarding/username' })
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(convexQuery(api.app.getCurrentUser, {})),
})

function DashboardLayout() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}))

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
      <Navigation user={user} />
      <Header />
      <Outlet />
    </div>
  )
}
