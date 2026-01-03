import { z } from "zod";

const RoleSchema = z.union([
  z.literal("N/A"),
  z.string().min(2).max(100)
]);
/**
 * Career Profile Schema
 */
export const CareerProfileSchema = z.object({
  atsScore: z
    .number()
    .int()
    .min(0)
    .max(100),

  bestRole: RoleSchema,

  nearestNextRole: RoleSchema,

  skillGaps: z
    .array(z.string().min(1))
})
.refine(data => {
  if (data.bestRole === "N/A") {
    return data.nearestNextRole === "N/A" && data.skillGaps.length === 0;
  }
  return true;
}, {
  message: "If bestRole is N/A, nearestNextRole must be N/A and skillGaps must be empty"
});

/**
 * Career Profile Interface
 */
export type CareerProfile = z.infer<typeof CareerProfileSchema>;
