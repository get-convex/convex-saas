import { useAuthActions } from '@convex-dev/auth/react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '@cvx/_generated/api'
import { CURRENCIES } from '@cvx/schema'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS classnames with support for conditional classes.
 * Widely used for Radix components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a function that calls all of its arguments.
 */
export function callAll<Args extends unknown[]>(
  ...fns: (((...args: Args) => unknown) | undefined)[]
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args))
}

/**
 * Locales.
 */
export function getLocaleCurrency() {
  return navigator.languages.includes('en-US') ? CURRENCIES.USD : CURRENCIES.EUR
}

export const useSignOut = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const { signOut } = useAuthActions()

  return async () => {
    await signOut()
    await router.invalidate()
    navigate({ to: '/' })
  }
}

export const useUser = () => {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}))
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' })
    }
  }, [user])

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return user!
}
