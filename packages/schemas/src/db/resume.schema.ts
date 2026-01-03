import { z } from "zod";
import { ResumeSchema } from "../ai/resume.schema.js";
// ---- Helpers ----
const ObjectIdSchema = z.any(); 
// (DB layer pe mongoose handle karega, yaha sirf placeholder)

const RoleSchema = z.union([
  z.literal("N/A"),
  z.string().min(2).max(100)
]);

// ---- Main Resume Schema ----
export const ResumeDbSchema = z.object({
  user: ObjectIdSchema,

  id: z.string().min(1),

  resourceType: z.string().min(1),

  extension: z.string().min(1),

  // -------- Resume Content --------
  content: ResumeSchema, 
  // Resume ka internal shape tum @resume-buddy/schemas se already validate kar rahe ho

  // -------- Career Analysis --------
  atsScore: z.number().int().min(0).max(100),

  bestRole: RoleSchema,

  nearestNextRole: RoleSchema,

  skillGaps: z
    .array(z.string().min(1).max(50))
    .max(6),

  // -------- Meta --------
  version: z.number().int().min(1),

  analysedAt: z.date().optional(),

  createdAt: z.date(),

  updatedAt: z.date()
});

export type ResumeDb = z.infer<typeof ResumeDbSchema>;
