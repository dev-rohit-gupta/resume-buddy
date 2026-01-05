import { z } from "zod";

export const AIOutputSchema = z.object({
  stats: z.object({
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
    learningFocused: z.boolean(),
    competitionLevel: z.enum(["Low", "Medium", "High"]),
    match: z.enum(["Low", "Partial", "Good", "Perfect"]),
  }),

  atsAnalysis: z.object({
    atsScore: z.number().min(0).max(100),
    selectionProbability: z.enum(["Low", "Medium", "High"]),
    reasons: z.array(z.string()),
  }),

  skillGapAnalysis: z.object({
    matchedSkills: z.array(z.string()),
    missingSkills: z.array(
      z.object({
        skill: z.string(),
        priority: z.enum(["High", "Medium", "Low"]),
        whyItMatters: z.string(),
      })
    ),
  }),

  learningPlan: z.object({
    mustLearnFirst: z.array(
      z.object({
        skill: z.string(),
        estimatedTime: z.string(),
        impact: z.string(),
      })
    ),
    goodToHave: z.array(z.string()),
  }),

  applicationDecision: z.object({
    shouldApply: z.boolean(),
    recommendation: z.enum(["Apply Now", "Apply After Preparation", "Skip"]),
    reasoning: z.array(z.string()),
  }),

  precautions: z.object({
    riskLevel: z.enum(["Low", "Medium", "High"]),
    notes: z.array(z.string()),
  }),

  resumeActions: z.object({
    add: z.array(z.string()),
    improve: z.array(z.string()),
    remove: z.array(z.string()),
  }),
});

export type AIOutput = z.infer<typeof AIOutputSchema>;
