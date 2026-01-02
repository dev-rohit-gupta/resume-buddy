import type { GenerateContentConfig } from "@google/genai";

export const AI_ENGINE_CONFIG = {
  model: "gemini-2.5-flash-lite",

  generation: {
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
  } satisfies Omit<GenerateContentConfig, "systemInstruction">,
} as const;

export type AIEngineConfig = typeof AI_ENGINE_CONFIG;
