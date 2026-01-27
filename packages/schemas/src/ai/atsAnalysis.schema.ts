import { z } from "zod";

// Shared level type
export const analysisLevelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3)
]);

export type AnalysisLevel = z.infer<typeof analysisLevelSchema>;

// Base structure for each signal
export const analysisSignalSchema = z.object({
  level: analysisLevelSchema,
  reason: z.string() // short human-readable justification
});

export type AnalysisSignal = z.infer<typeof analysisSignalSchema>;

// Global signals
export const globalSignalsSchema = z.object({
  workEvidence: analysisSignalSchema,        // quality of real work
  skillApplication: analysisSignalSchema,    // depth of skill usage
  outcomeImpact: analysisSignalSchema,       // results / impact
  clarityStructure: analysisSignalSchema,    // readability & layout
  consistency: analysisSignalSchema,         // logical consistency
  specificity: analysisSignalSchema,         // concrete vs generic
  effortSignal: analysisSignalSchema,        // customization & intent
  redFlags: analysisSignalSchema             // risk signals (0 = none)
});

export type GlobalSignals = z.infer<typeof globalSignalsSchema>;

// Raw observations
export const rawObservationsSchema = z.object({
  projectsDetected: z.boolean().optional(),
  internshipDetected: z.boolean().optional(),
  metricsMentioned: z.boolean().optional(),
  portfolioDetected: z.boolean().optional()
});

export type RawObservations = z.infer<typeof rawObservationsSchema>;

// Main resume analysis report
export const generalAtsReportSchema = z.object({
  globalSignals: globalSignalsSchema,
  rawObservations: rawObservationsSchema.optional()
});

export type GeneralAtsReport = z.infer<typeof generalAtsReportSchema>;