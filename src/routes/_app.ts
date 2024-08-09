import { userQuery } from '@/utils/misc'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    // Ensure the user query is loaded before rendering the app.
    await context.queryClient.ensureQueryData(userQuery)
  },
})
