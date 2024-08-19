import { Doc } from "~/convex/_generated/dataModel";
import { PlanKey } from "~/convex/schema";

export type User = Doc<"users"> & {
  avatarUrl?: string;
  subscription?: Doc<"subscriptions"> & {
    planKey: PlanKey;
  };
};
