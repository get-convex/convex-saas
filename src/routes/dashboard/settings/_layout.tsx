import { createFileRoute, Link } from '@tanstack/react-router'
import { cn } from '@/utils/misc'
import { buttonVariants } from '@/ui/button-util'

export const Route = createFileRoute('/dashboard/settings/_layout')({
  component: DashboardSettingsLayout,
  beforeLoad: () => ({
    title: 'Settings',
  }),
})

export default function DashboardSettingsLayout() {
  return (
    <div className="flex h-full w-full px-6 py-8">
      <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
        <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
          <Link
            to={ROUTE_PATH}
            className={cn(
              `${buttonVariants({ variant: 'ghost' })} ${isSettingsPath && 'bg-primary/5'} justify-start rounded-md`,
            )}
          >
            <span
              className={cn(
                `text-sm text-primary/80 ${isSettingsPath && 'font-medium text-primary'}`,
              )}
            >
              General
            </span>
          </Link>
          <Link
            to={BILLING_PATH}
            prefetch="intent"
            className={cn(
              `${buttonVariants({ variant: 'ghost' })} ${isBillingPath && 'bg-primary/5'} justify-start rounded-md`,
            )}
          >
            <span
              className={cn(
                `text-sm text-primary/80 ${isBillingPath && 'font-medium text-primary'}`,
              )}
            >
              Billing
            </span>
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
