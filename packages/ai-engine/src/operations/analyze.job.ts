import { createGeminiClient } from "../client/gemini.client.js";
import { runEngine } from "../engine/run.engine.js";
import { AIInputSchema, AIOutputSchema } from "@resume-buddy/schemas";
import type { AIInput, AIOutput, User } from "@resume-buddy/schemas";
import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { EngineInput } from "@resume-buddy/schemas";
import { safeParseAIJson } from "@resume-buddy/utils";
import { GenerateContentConfig, ThinkingLevel } from "@google/genai";

const config : GenerateContentConfig = {
  systemInstruction: SYSTEM_INSTRUCTION.JOB_ANALYSIS,
  thinkingConfig : {
    thinkingLevel: ThinkingLevel.HIGH,
  }
};

export async function analyzeJob(user: User, jobData: AIInput): Promise<AIOutput> {
  // create Gemini AI client
  const ai = createGeminiClient();
  // validate input first
  const validatedInput = AIInputSchema.parse(jobData);
  // prepare inputs for the engine
  const inputs: EngineInput[] = [
    { type: "text", value: JSON.stringify(validatedInput) },
    { type: "metadata", value: user },
  ];
  const result = await runEngine({
    ai,
    model: "gemini-3-flash-preview",
    inputs,
    config,
  });

  // validate AI output
  const cleanedResult = safeParseAIJson<AIOutput>(result);
  return AIOutputSchema.parse(cleanedResult);
}
