import { createGeminiClient } from "../client/gemini.client.js";
import { runEngine } from "../engine/run.engine.js";
import { AIInputSchema, AIOutputSchema } from "@resume-buddy/schemas";
import type { AIInput, AIOutput } from "@resume-buddy/schemas";
import { AI_ENGINE_CONFIG } from "../ai-engine.config.js";
import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { EngineInput } from "@resume-buddy/schemas";

// create Gemini AI client
const ai = createGeminiClient();

export async function analyzeJob(input: AIInput): Promise<AIOutput> {
  // validate input first
  const validatedInput = AIInputSchema.parse(input);
  const inputs: EngineInput[] = [{ type: "text", value: JSON.stringify(validatedInput) }];
  const result = await runEngine({
    ai,
    systemInstruction: SYSTEM_INSTRUCTION.JOB_ANALYSIS,
    inputs,
    config: AI_ENGINE_CONFIG,
  });

  // validate AI output
  return AIOutputSchema.parse(result);
}
