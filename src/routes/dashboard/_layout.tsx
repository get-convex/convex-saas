import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Navigation } from '@/ui/navigation'
import { Header } from '@/ui/header'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/convex/_generated/api'
import { Route as OnboardingUsernameRoute } from '@/routes/onboarding/_layout.username'
import { Route as AuthLoginRoute } from '@/routes/auth/_layout.login'

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayout,

  beforeLoad: async ({ context, location }) => {
    await context.queryClient.ensureQueryData(convexQuery(api.app.getCurrentUser, {}))
    if (!context.user) {
      throw redirect({
        to: AuthLoginRoute.fullPath,
        search: {
          redirect: location.href,
        },
      })
    }
    if (!context.user.username) {
      throw redirect({ to: OnboardingUsernameRoute.fullPath })
    }
  },
})

function DashboardLayout() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}))
  console.log('user', user)

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
