import type { GenerateContentConfig } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./prompts/system.prompt.js";

export const AI_ENGINE_CONFIG = {
  model: "gemini-1.5-flash",

  generation: {
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
    systemInstruction: SYSTEM_INSTRUCTION,
  } satisfies GenerateContentConfig,
} as const;

export type AIEngineConfig = typeof AI_ENGINE_CONFIG;
