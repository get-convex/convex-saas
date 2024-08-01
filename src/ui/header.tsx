import { useRouteContext, useRouter } from '@tanstack/react-router'

export function Header() {
  const router = useRouter()
  const routeContext = useRouteContext({
    from: router.state.matches.slice(-1)[0].id,
  })

  /*
  const headerTitle = () => {
    if (location.pathname === DASHBOARD_PATH) return 'Dashboard'
    if (location.pathname === BILLING_PATH) return 'Billing'
    if (location.pathname === SETTINGS_PATH) return 'Settings'
    if (location.pathname === ADMIN_PATH) return 'Admin'
  }
  const headerDescription = () => {
    if (location.pathname === DASHBOARD_PATH)
      return 'Manage your Apps and view your usage.'
    if (location.pathname === SETTINGS_PATH) return 'Manage your account settings.'
    if (location.pathname === BILLING_PATH)
      return 'Manage billing and your subscription plan.'
    if (location.pathname === ADMIN_PATH) return 'Your admin dashboard.'
  }
    */

  return (
    <header className="z-10 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-12">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-medium text-primary/80">
            {routeContext.headerTitle}
          </h1>
          <p className="text-base font-normal text-primary/60">
            {routeContext.headerDescription}
          </p>
        </div>
      </div>
    </header>
  )
}
