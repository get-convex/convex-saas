import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useEffect, useState } from "react";
import { Route as OnboardingUsernameRoute } from "@/routes/_app/_auth/onboarding/_layout.username";
import { Route as DashboardRoute } from "@/routes/_app/_auth/dashboard/_layout.index";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexAuth } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";

export const Route = createFileRoute("/_app/login/_layout/")({
  component: Login,
});

function Login() {
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const navigate = useNavigate();
  useEffect(() => {
    if ((isLoading && !isAuthenticated) || !user) {
      return;
    }
    if (!isLoading && isAuthenticated && !user.username) {
      navigate({ to: OnboardingUsernameRoute.fullPath });
      return;
    }
    if (!isLoading && isAuthenticated) {
      navigate({ to: DashboardRoute.fullPath });
      return;
    }
  }, [user]);

  if (step === "signIn") {
    return <LoginForm onSubmit={(email) => setStep({ email })} />;
  }
  return <VerifyForm email={step.email} />;
}

function LoginForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      await signIn("resend-otp", value);
      onSubmit(value.email);
      setIsSubmitting(false);
    },
  });
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <h3 className="text-center text-2xl font-medium text-primary">
          Continue to Convex SaaS
        </h3>
        <p className="text-center text-base font-normal text-primary/60">
          Welcome back! Please log in to continue.
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
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <form.Field
            name="email"
            validators={{
              onSubmit: z
                .string()
                .max(256)
                .email("Email address is not valid."),
            }}
            children={(field) => (
              <Input
                placeholder="Email"
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
          {form.state.fieldMeta.email?.errors.length > 0 && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {form.state.fieldMeta.email?.errors.join(" ")}
            </span>
          )}
          {/*
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
          */}
        </div>

        <Button type="submit" className="w-full">
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Continue with Email"
          )}
        </Button>
      </form>

      <div className="relative flex w-full items-center justify-center">
        <span className="absolute w-full border-b border-border" />
        <span className="z-10 bg-card px-2 text-xs font-medium uppercase text-primary/60">
          Or continue with
        </span>
      </div>

      <div className="w-full">
        <Button
          variant="outline"
          className="w-full gap-2 bg-transparent"
          onClick={() => signIn("github", { redirectTo: "/login" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary/80 group-hover:text-primary"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="nonzero"
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          Github
        </Button>
      </div>

      <p className="px-12 text-center text-sm font-normal leading-normal text-primary/60">
        By clicking continue, you agree to our{" "}
        <a className="underline hover:text-primary">Terms of Service</a> and{" "}
        <a className="underline hover:text-primary">Privacy Policy.</a>
      </p>
    </div>
  );
}

function VerifyForm({ email }: { email: string }) {
  const { signIn } = useAuthActions();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      code: "",
    },
    onSubmit: async ({ value }) => {
      await signIn("resend-otp", { email, code: value.code });
    },
  });
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <p className="text-center text-2xl text-primary">Check your inbox!</p>
        <p className="text-center text-base font-normal text-primary/60">
          We've just emailed you a temporary password.
          <br />
          Please enter it below.
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
          <label htmlFor="code" className="sr-only">
            Code
          </label>
          <form.Field
            name="code"
            validators={{
              onSubmit: z
                .string()
                .min(8, "Code must be at least 8 characters."),
            }}
            children={(field) => {
              return (
                <Input
                  placeholder="Code"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`bg-transparent ${
                    field.state.meta?.errors.length > 0 &&
                    "border-destructive focus-visible:ring-destructive"
                  }`}
                />
              );
            }}
          />
        </div>

        <div className="flex flex-col">
          {form.state.fieldMeta.code?.errors.length > 0 && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {form.state.fieldMeta.code?.errors.join(" ")}
            </span>
          )}
          {/*
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
          */}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      {/* Request New Code. */}
      <div className="flex w-full flex-col">
        <p className="text-center text-sm font-normal text-primary/60">
          Did not receive the code?
        </p>
        <Button
          onClick={() => signIn("resend-otp", { email })}
          variant="ghost"
          className="w-full hover:bg-transparent"
        >
          Request New Code
        </Button>
      </div>
    </div>
  );
}
