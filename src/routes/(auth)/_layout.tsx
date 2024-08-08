import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { Route as LoginRoute } from '@/routes/login/_layout'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/_layout')({
  component: () => {
    const { isAuthenticated } = useConvexAuth()
    const navigate = useNavigate()
    useEffect(() => {
      // Redirect to login if not authenticated
      console.log('isAuthenticated', isAuthenticated)
      console.log('redirecting')
      if (!isAuthenticated) {
        navigate({ to: LoginRoute.fullPath })
      }
    }, [isAuthenticated])
    return <Outlet />
  },
})
