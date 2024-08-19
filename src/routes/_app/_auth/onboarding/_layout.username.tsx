import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { Route as DashboardRoute } from "@/routes/_app/_auth/dashboard/_layout.index";
import * as validators from "@/utils/validators";
import { useEffect, useState } from "react";
import { getLocaleCurrency } from "@/utils/misc";

export const Route = createFileRoute("/_app/_auth/onboarding/_layout/username")(
  {
    component: OnboardingUsername,
    beforeLoad: () => ({
      title: `Username`,
    }),
  },
);

export default function OnboardingUsername() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: completeOnboarding } = useMutation({
    mutationFn: useConvexMutation(api.app.completeOnboarding),
  });
  const navigate = useNavigate();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      username: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      await completeOnboarding({
        username: value.username,
        currency: getLocaleCurrency(),
      });
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (user?.username) {
      navigate({ to: DashboardRoute.fullPath });
    }
  }, [user?.username]);

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="mb-2 select-none text-6xl">👋</span>
        <h3 className="text-center text-2xl font-medium text-primary">
          Welcome!
        </h3>
        <p className="text-center text-base font-normal text-primary/60">
          Let's get started by choosing a username.
        </p>
      </div>
      <form
        className="flex w-full flex-col items-start gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <form.Field
            name="username"
            validators={{
              onSubmit: validators.username,
            }}
            children={(field) => (
              <Input
                placeholder="Username"
                autoComplete="off"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`bg-transparent ${
                  field.state.meta?.errors.length > 0 &&
                  "border-destructive focus-visible:ring-destructive"
                }`}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          {form.state.fieldMeta.username?.errors.length > 0 && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {form.state.fieldMeta.username?.errors.join(" ")}
            </span>
          )}
        </div>

        <Button type="submit" size="sm" className="w-full">
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
        </Button>
      </form>

      <p className="px-6 text-center text-sm font-normal leading-normal text-primary/60">
        You can update your username at any time from your account settings.
      </p>
    </div>
  );
}
