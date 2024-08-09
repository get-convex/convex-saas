import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from './-ui.navigation'
import { Header } from '@/ui/header'
import { useUser } from '@/utils/misc'

export const Route = createFileRoute('/_app/dashboard/_layout')({
  component: DashboardLayout,
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
