/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    // auth will initially be undefined
    // We'll be passing down the auth state from within a React component
    auth: undefined!,
    user: undefined!,
    queryClient: undefined!,
  },
})
