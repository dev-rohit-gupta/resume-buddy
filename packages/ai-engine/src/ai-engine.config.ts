import type { GenerateContentConfig } from "@google/genai";

export const AI_ENGINE_CONFIG = {
  generation: {
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
  } satisfies Omit<GenerateContentConfig, "systemInstruction">,
} as const;

export type AIEngineConfig = typeof AI_ENGINE_CONFIG;
