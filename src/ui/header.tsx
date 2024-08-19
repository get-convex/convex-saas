import { useRouteContext, useRouter } from "@tanstack/react-router";

export function Header() {
  const router = useRouter();
  const routeContext = useRouteContext({
    from: router.state.matches.slice(-1)[0].id,
  });

  return (
    <header className="z-10 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-12">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-medium text-primary/80">
            {routeContext?.headerTitle}
          </h1>
          <p className="text-base font-normal text-primary/60">
            {routeContext?.headerDescription}
          </p>
        </div>
      </div>
    </header>
  );
}
