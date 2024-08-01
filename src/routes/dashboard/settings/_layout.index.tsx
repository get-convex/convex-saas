import { createFileRoute } from '@tanstack/react-router'
import { Upload } from 'lucide-react'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useDoubleCheck } from '@/ui/use-double-check'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '~/convex/_generated/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useRef } from 'react'

export const Route = createFileRoute('/dashboard/settings/_layout/')({
  component: DashboardSettings,
})

export default function DashboardSettings() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}))
  const { mutateAsync: updateUsername } = useMutation({
    mutationFn: useConvexMutation(api.app.updateUsername),
  })
  const { mutateAsync: updateUserImage } = useMutation({
    mutationFn: useConvexMutation(api.app.updateUserImage),
  })
  const generateUploadUrl = useConvexMutation(api.app.generateUploadUrl)
const fileInputRef = useRef<HTMLInputElement>(null);
const { startUpload } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploaded) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await updateUserImage({ imageId: (uploaded[0].response as any).storageId });
    },
  });
  const { doubleCheck, getButtonProps } = useDoubleCheck()

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      updateUsername({ username: value.username })
    },
  })

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Avatar */}
      <form
        className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex w-full items-start justify-between rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">Your Avatar</h2>
            <p className="text-sm font-normal text-primary/60">
              This is your avatar. It will be displayed on your profile.
            </p>
          </div>
          <label
            htmlFor={avatarFields.imageFile.id}
            className="group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95"
          >
            {imageSrc || user.image?.id
              ? (
                  <img
                    src={imageSrc ?? getUserImgSrc(user.image?.id)}
                    className="h-20 w-20 rounded-full object-cover"
                    alt={user.username ?? user.email}
                  />
                )
              : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                )}
            <div className="absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="peer sr-only"
            required
            tabIndex={user ? -1 : 0}
            onChange={async (event) => {
              if (!event.target.files) {
                return
              }
              const files = Array.from(event.target.files)
              if (files.length === 0) {
                return
              }
              const uploaded = await startUpload(files)
            }}
          />
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            Click on the avatar to upload a custom one from your files.
          </p>
          {user.image?.id && !avatarFields.imageFile.errors && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                resetImageFetcher.submit(
                  {},
                  {
                    method: 'POST',
                    action: RESET_IMAGE_PATH,
                  },
                )
                if (imageFormRef.current) {
                  imageFormRef.current.reset()
                }
              }}
            >
              Reset
            </Button>
          )}
          {avatarFields.imageFile.errors && (
            <p className="text-right text-sm text-destructive dark:text-destructive-foreground">
              {avatarFields.imageFile.errors.join(' ')}
            </p>
          )}
        </div>
      </uploadImageFetcher.Form>

      {/* Username */}
      <Form
        method="POST"
        className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
        {...getFormProps(form)}
      >
        <div className="flex w-full flex-col gap-4 rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">Your Username</h2>
            <p className="text-sm font-normal text-primary/60">
              This is your username. It will be displayed on your profile.
            </p>
          </div>
          <Input
            placeholder="Username"
            autoComplete="off"
            defaultValue={user?.username ?? ''}
            required
            className={`w-80 bg-transparent ${
              username.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getInputProps(username, { type: 'text' })}
          />
          {username.errors && (
            <p className="text-sm text-destructive dark:text-destructive-foreground">
              {username.errors.join(' ')}
            </p>
          )}
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            Please use 32 characters at maximum.
          </p>
          <Button
            type="submit"
            size="sm"
            name={INTENTS.INTENT}
            value={INTENTS.USER_UPDATE_USERNAME}
          >
            Save
          </Button>
        </div>
      </Form>

      {/* Delete Account */}
      <div className="flex w-full flex-col items-start rounded-lg border border-destructive bg-card">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="text-xl font-medium text-primary">Delete Account</h2>
          <p className="text-sm font-normal text-primary/60">
            Permanently delete your Remix SaaS account, all of your projects, links and
            their respective stats.
          </p>
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-red-500/10 px-6 dark:bg-red-500/10">
          <p className="text-sm font-normal text-primary/60">
            This action cannot be undone, proceed with caution.
          </p>
          <Form method="POST">
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              name={INTENTS.INTENT}
              value={INTENTS.USER_DELETE_ACCOUNT}
              {...getButtonProps()}
            >
              {doubleCheck ? 'Are you sure?' : 'Delete Account'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
