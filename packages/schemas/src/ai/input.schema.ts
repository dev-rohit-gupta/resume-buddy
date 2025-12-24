import { z } from "zod";

/* ---------------- ENUMS ---------------- */

export const JobTypeSchema = z.enum([
  "Internship",
  "Job",
  "Freelance",
]);

export const CompanyTypeSchema = z.enum([
  "NGO",
  "Startup",
  "MNC",
  "Unknown",
]);

export const LocationTypeSchema = z.enum([
  "Remote",
  "Onsite",
  "Hybrid",
]);

export const SkillLevelSchema = z.enum([
  "Basic",
  "Intermediate",
  "Advanced",
]);

export const StipendTypeSchema = z.enum([
  "Paid",
  "Unpaid",
]);

export const FrequencySchema = z.enum([
  "Monthly",
  "Weekly",
]);

/* ---------------- MAIN SCHEMA ---------------- */

export const AIInputSchema = z.object({
  jobMeta: z.object({
    source: z.string(),
    jobType: JobTypeSchema,
    title: z.string(),
    companyName: z.string(),
    companyType: CompanyTypeSchema,
    location: z.object({
      type: LocationTypeSchema,
      city: z.string().nullable(),
      country: z.string(),
    }),
    postedDate: z.string(), // ISO string
    applyBy: z.string(),    // ISO string
    openings: z.number().int().min(1),
  }),

  workDetails: z.object({
    duration: z.string(),
    startDate: z.string(),
    stipend: z.object({
      type: StipendTypeSchema,
      amount: z.number().nullable(),
      currency: z.string().nullable(),
      frequency: FrequencySchema.nullable(),
    }),
    responsibilities: z.array(z.string()),
    learningOutcomes: z.array(z.string()),
  }),

  skills: z.object({
    required: z.array(
      z.object({
        name: z.string(),
        level: SkillLevelSchema,
      })
    ),
    frameworks: z.array(z.string()),
    databases: z.array(z.string()),
    tools: z.array(z.string()),
    optional: z.array(z.string()),
  }),

  eligibility: z.object({
    education: z.array(z.string()),
    year: z.array(z.string()),
    experienceRequired: z.boolean(),
    minAge: z.number().nullable(),
    otherCriteria: z.array(z.string()),
  }),

  perks: z.object({
    certificate: z.boolean(),
    letterOfRecommendation: z.boolean(),
    jobOffer: z.boolean(),
    flexibleHours: z.boolean(),
  }),

  companyInfo: z.object({
    description: z.string(),
    industry: z.string(),
    website: z.string().url().nullable(),
    trustScore: z.number().min(0).max(100).nullable(),
  }),

  rawData: z.object({
    fullDescriptionText: z.string(),
    sourceURL: z.string().url(),
  }),
}).strict();

/* ---------------- TYPES ---------------- */
export type AIInput = z.infer<typeof AIInputSchema>;