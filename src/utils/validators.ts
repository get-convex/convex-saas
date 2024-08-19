import { z } from "zod";

export const username = z
  .string()
  .min(3)
  .max(20)
  .toLowerCase()
  .trim()
  .regex(
    /^[a-zA-Z0-9]+$/,
    "Username may only contain alphanumeric characters.",
  );
