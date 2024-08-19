import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useDoubleCheck } from "@/ui/use-double-check";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "~/convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import * as validators from "@/utils/validators";
import { useSignOut } from "@/utils/misc";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/settings/")(
  {
    component: DashboardSettings,
    beforeLoad: () => ({
      title: "Settings",
      headerTitle: "Settings",
      headerDescription: "Manage your account settings.",
    }),
  },
);

export default function DashboardSettings() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const signOut = useSignOut();
  const { mutateAsync: updateUsername } = useMutation({
    mutationFn: useConvexMutation(api.app.updateUsername),
  });
  const { mutateAsync: updateUserImage } = useMutation({
    mutationFn: useConvexMutation(api.app.updateUserImage),
  });
  const { mutateAsync: removeUserImage } = useMutation({
    mutationFn: useConvexMutation(api.app.removeUserImage),
  });
  const { mutateAsync: deleteCurrentUserAccount } = useMutation({
    mutationFn: useConvexMutation(api.app.deleteCurrentUserAccount),
  });
  const generateUploadUrl = useConvexMutation(api.app.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploaded) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await updateUserImage({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        imageId: (uploaded[0].response as any).storageId,
      });
    },
  });
  const { doubleCheck, getButtonProps } = useDoubleCheck();

  const usernameForm = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      username: user?.username,
    },
    onSubmit: async ({ value }) => {
      await updateUsername({ username: value.username || "" });
    },
  });

  const handleDeleteAccount = async () => {
    await deleteCurrentUserAccount({});
    signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Avatar */}
      <div className="flex w-full flex-col items-start rounded-lg border border-border bg-card">
        <div className="flex w-full items-start justify-between rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">Your Avatar</h2>
            <p className="text-sm font-normal text-primary/60">
              This is your avatar. It will be displayed on your profile.
            </p>
          </div>
          <label
            htmlFor="avatar_field"
            className="group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                className="h-20 w-20 rounded-full object-cover"
                alt={user.username ?? user.email}
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
            )}
            <div className="absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
          </label>
          <input
            ref={fileInputRef}
            id="avatar_field"
            type="file"
            accept="image/*"
            className="peer sr-only"
            required
            tabIndex={user ? -1 : 0}
            onChange={async (event) => {
              if (!event.target.files) {
                return;
              }
              const files = Array.from(event.target.files);
              if (files.length === 0) {
                return;
              }
              startUpload(files);
            }}
          />
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            Click on the avatar to upload a custom one from your files.
          </p>
          {user.avatarUrl && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                removeUserImage({});
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Username */}
      <form
        className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          usernameForm.handleSubmit();
        }}
      >
        <div className="flex w-full flex-col gap-4 rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">Your Username</h2>
            <p className="text-sm font-normal text-primary/60">
              This is your username. It will be displayed on your profile.
            </p>
          </div>
          <usernameForm.Field
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
                className={`w-80 bg-transparent ${
                  field.state.meta?.errors.length > 0 &&
                  "border-destructive focus-visible:ring-destructive"
                }`}
              />
            )}
          />
          {usernameForm.state.fieldMeta.username?.errors.length > 0 && (
            <p className="text-sm text-destructive dark:text-destructive-foreground">
              {usernameForm.state.fieldMeta.username?.errors.join(" ")}
            </p>
          )}
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            Please use 32 characters at maximum.
          </p>
          <Button type="submit" size="sm">
            Save
          </Button>
        </div>
      </form>

      {/* Delete Account */}
      <div className="flex w-full flex-col items-start rounded-lg border border-destructive bg-card">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="text-xl font-medium text-primary">Delete Account</h2>
          <p className="text-sm font-normal text-primary/60">
            Permanently delete your Convex SaaS account, all of your projects,
            links and their respective stats.
          </p>
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-red-500/10 px-6 dark:bg-red-500/10">
          <p className="text-sm font-normal text-primary/60">
            This action cannot be undone, proceed with caution.
          </p>
          <Button
            size="sm"
            variant="destructive"
            {...getButtonProps({
              onClick: doubleCheck ? handleDeleteAccount : undefined,
            })}
          >
            {doubleCheck ? "Are you sure?" : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
