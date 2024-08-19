import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    // Ensure the user query is loaded before rendering the app.
    await context.queryClient.ensureQueryData(
      convexQuery(api.app.getCurrentUser, {}),
    );
  },
});
