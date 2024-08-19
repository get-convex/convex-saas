/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
  },
});
