import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { cn } from "@/utils/misc";
import { buttonVariants } from "@/ui/button-util";
import { Route as SettingsRoute } from "@/routes/_app/_auth/dashboard/_layout.settings.index";
import { Route as BillingSettingsRoute } from "@/routes/_app/_auth/dashboard/_layout.settings.billing";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/settings")({
  component: DashboardSettingsLayout,
});

export default function DashboardSettingsLayout() {
  const matchRoute = useMatchRoute();
  const isSettingsPath = matchRoute({ to: SettingsRoute.fullPath });
  const isBillingPath = matchRoute({ to: BillingSettingsRoute.fullPath });
  return (
    <div className="flex h-full w-full px-6 py-8">
      <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
        <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
          <Link
            to={SettingsRoute.fullPath}
            className={cn(
              `${buttonVariants({ variant: "ghost" })} ${isSettingsPath && "bg-primary/5"}`,
              "justify-start rounded-md",
            )}
          >
            <span
              className={cn(
                `text-sm text-primary/80 ${isSettingsPath && "font-medium text-primary"}`,
              )}
            >
              General
            </span>
          </Link>
          <Link
            to={BillingSettingsRoute.fullPath}
            className={cn(
              `${buttonVariants({ variant: "ghost" })} ${isBillingPath && "bg-primary/5"} justify-start rounded-md`,
            )}
          >
            <span
              className={cn(
                `text-sm text-primary/80 ${isBillingPath && "font-medium text-primary"}`,
              )}
            >
              Billing
            </span>
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
