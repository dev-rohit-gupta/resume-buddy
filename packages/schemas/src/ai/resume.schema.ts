import { z } from "zod";
import { emailSchema } from "../email.schema.js";
import { optionalString, optionalUrl, safeArray } from "../optional.schemas.js";

/**
 * Schema for validating and parsing resume data.
 */
export const ResumeSchema = z.object({
  basics: z.object({
    name: optionalString,
    email: emailSchema.optional().nullable(),
    phone: optionalString,
    location: optionalString,

    links: z
      .object({
        linkedin: optionalUrl,
        github: optionalUrl,
        portfolio: optionalUrl,
      })
      .optional()
      .nullable(),
  }),

  summary: optionalString,

  education: safeArray(
    z.object({
      degree: optionalString,
      field: optionalString,
      institution: optionalString,
      startYear: optionalString,
      endYear: optionalString,
      grade: optionalString,
    })
  ),

  experience: safeArray(
    z.object({
      role: optionalString,
      company: optionalString,
      location: optionalString,
      startDate: optionalString,
      endDate: optionalString,
      description: safeArray(z.string()),
      type: z.enum(["job", "internship"]).optional(),
    })
  ),

  projects: safeArray(
    z.object({
      title: optionalString,
      description: optionalString,
      techStack: safeArray(z.string()),
      link: optionalUrl,
    })
  ),

  skills: z
    .object({
      technical: safeArray(z.string()),
      soft: safeArray(z.string()),
      tools: safeArray(z.string()),
    })
    .optional()
    .nullable(),

  certifications: safeArray(
    z.object({
      name: optionalString,
      issuer: optionalString,
      year: optionalString,
      url: optionalUrl,
    })
  ),

  achievements: safeArray(
    z.object({
      title: optionalString,
      description: optionalString,
      year: optionalString,
    })
  ),

  languages: safeArray(
    z.object({
      name: z.string(),
      proficiency: z.enum(["basic", "intermediate", "fluent", "native"]).optional(),
    })
  ),

  metadata: z.object({
    resumeVersion: z.number().default(1),
    extractedAt: z.string(),
    sourceFileType: z.enum(["pdf", "docx"]),
    confidenceScore: z.number().min(0).max(1).optional(),
  }),
});

// TypeScript type inferred from the schema
export type Resume = z.infer<typeof ResumeSchema>;
