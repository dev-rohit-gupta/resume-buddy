import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { runEngine } from "../engine/run.engine.js";
import { createGeminiClient } from "../client/gemini.client.js";
import { AI_ENGINE_CONFIG } from "../ai-engine.config.js";
import { safeParseAIJson } from "@resume-buddy/utils";
import {
  EngineInput,
  Resume,
  ResumeSchema,
  CareerProfile,
  CareerProfileSchema,
} from "@resume-buddy/schemas";

export async function buildCareerProfile(resume: Resume): Promise<CareerProfile> {
  const validatedResume = ResumeSchema.parse(resume);
  // create Gemini AI client
  const ai = createGeminiClient();
  // prepare inputs for the engine
  const inputs: EngineInput[] = [{ type: "metadata", value: validatedResume }];
  const result = await runEngine({
    ai,
    systemInstruction: SYSTEM_INSTRUCTION.CAREER_PROFILE,
    inputs,
    config: AI_ENGINE_CONFIG,
  });
  // validate AI output
  const cleanedResult = safeParseAIJson<CareerProfile>(result);
  return CareerProfileSchema.parse(cleanedResult);
}
