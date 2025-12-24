import { createGeminiClient } from "../client/gemini.client.js";
import { runEngine } from "../engine/run.engine.js";
import { AIInputSchema, AIOutputSchema } from "@resume-buddy/schemas";
import type { AIInput , AIOutput } from "@resume-buddy/schemas";
import { AI_ENGINE_CONFIG } from "../ai-engine.config.js";

// create Gemini AI client
const ai = createGeminiClient();

export async function analyzeJob(input: AIInput) {
  // validate input first
  const validatedInput = AIInputSchema.parse(input);
  
  const result = await runEngine({
    ai,
    prompt: JSON.stringify(validatedInput),
    config: AI_ENGINE_CONFIG,
  });

  // validate AI output
  return AIOutputSchema.parse(result);
}
