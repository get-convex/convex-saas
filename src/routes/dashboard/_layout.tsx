import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from './-ui.navigation'
import { Header } from '@/ui/header'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '~/convex/_generated/api'
import { useUser } from '@/utils/misc'

export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.app.getCurrentUser, {}),
    )
  },
})

function DashboardLayout() {
  const user = useUser()
  return (
    <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
      <Navigation user={user} />
      <Header />
      <Outlet />
    </div>
  )
}
