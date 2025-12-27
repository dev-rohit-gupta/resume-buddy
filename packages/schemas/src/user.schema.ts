import z from "zod";
import { ResumeSchema } from "./ai/resume.schema.js";
import { emailSchema } from "./email.schema.js";
import { urlSchema } from "./url.schema.js";

/**
 * Schema for validating and parsing user data.
 */
export const UserSchema = z.object({
  id: z.string(), // uuid / public id
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),
  avatar: urlSchema.optional(),
  resume: ResumeSchema,
});

// Type for UserSchema
export type User = z.infer<typeof UserSchema>;
