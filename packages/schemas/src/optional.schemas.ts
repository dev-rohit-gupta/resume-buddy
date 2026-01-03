import { z } from "zod";


/**
 * AI-friendly optional string
 * - "" → undefined
 * - null → undefined
 */
export const optionalString = z
  .string()
  .trim()
  .optional()
  .nullable()
  .catch(null);

/**
 * AI-friendly optional URL
 * - null / "" → undefined
 * - allows missing protocol (adds https later if needed)
 */
export const optionalUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine(
    (v) =>
      !v ||
      /^https?:\/\//i.test(v) ||
      /^[\w.-]+\.[a-z]{2,}/i.test(v),
    "Invalid URL"
  )
  .catch(null);

/**
 * Safe array (AI sometimes sends null instead of [])
 */
export const safeArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).optional().nullable().transform((v) => v ?? undefined);
