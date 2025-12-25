import { z } from "zod";
import { emailSchema } from "../email.schema.js";
import { urlSchema } from "../url.schema.js";

/**
 * Schema for validating and parsing resume data.
 */
export const ResumeSchema = z.object({
  basics: z.object({
    name: z.string().optional(),
    email: emailSchema.optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    links: z
      .object({
        linkedin: urlSchema.optional(),
        github: urlSchema.optional(),
        portfolio: urlSchema.optional(),
      })
      .optional(),
  }),

  summary: z.string().optional(),

  education: z
    .array(
      z.object({
        degree: z.string().optional(),
        field: z.string().optional(),
        institution: z.string().optional(),
        startYear: z.string().optional(),
        endYear: z.string().optional(),
        grade: z.string().optional(),
      })
    )
    .optional(),

  experience: z
    .array(
      z.object({
        role: z.string().optional(),
        company: z.string().optional(),
        location: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.array(z.string()).optional(),
        type: z.enum(["job", "internship"]).optional(),
      })
    )
    .optional(),

  projects: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        techStack: z.array(z.string()).optional(),
        link: urlSchema.optional(),
      })
    )
    .optional(),

  skills: z
    .object({
      technical: z.array(z.string()).optional(),
      soft: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
    })
    .optional(),

  certifications: z
    .array(
      z.object({
        name: z.string().optional(),
        issuer: z.string().optional(),
        year: z.string().optional(),
        url: urlSchema.optional(),
      })
    )
    .optional(),

  achievements: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .optional(),

  languages: z
    .array(
      z.object({
        name: z.string(),
        proficiency: z.enum(["basic", "intermediate", "fluent", "native"]).optional(),
      })
    )
    .optional(),

  metadata: z.object({
    resumeVersion: z.number().default(1),
    extractedAt: z.string(),
    sourceFileType: z.enum(["pdf", "docx"]),
    confidenceScore: z.number().min(0).max(1).optional(),
  }),
});

// TypeScript type inferred from the schema
export type Resume = z.infer<typeof ResumeSchema>;
