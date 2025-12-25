import { z } from "zod";
/**
 * Schema for validating and parsing url data.
 */
export const urlSchema = z.string().refine(
  (val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL" }
);
