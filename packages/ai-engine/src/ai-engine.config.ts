import type { GenerateContentConfig } from "@google/genai";

export const AI_ENGINE_CONFIG = {
  model: "gemini-1.5-flash",

  generation: {
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  } satisfies Omit<GenerateContentConfig, "systemInstruction">,
} as const;

export type AIEngineConfig = typeof AI_ENGINE_CONFIG;
