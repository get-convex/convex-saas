import { ConvexReactClient, useConvexAuth } from 'convex/react'
import { RouterProvider } from '@tanstack/react-router'
import { convexQuery, ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/router'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { api } from '@cvx/_generated/api'

// Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

const convexQueryClient = new ConvexQueryClient(convex)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
})

convexQueryClient.connect(queryClient)

function InnerApp() {
  const auth = useConvexAuth()
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}))
  return <RouterProvider router={router} context={{ auth, user, queryClient }} />
}

const helmetContext = {}

export default function App() {
  return (
    <HelmetProvider context={helmetContext}>
      <ConvexAuthProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <InnerApp />
        </QueryClientProvider>
      </ConvexAuthProvider>
    </HelmetProvider>
  )
}
