import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { runEngine } from "../engine/run.engine.js";
import { createGeminiClient } from "../client/gemini.client.js";
import { safeParseAIJson } from "@resume-buddy/utils";
import { GenerateContentConfig, ThinkingLevel } from "@google/genai";
import {
  EngineInput,
  Resume,
  ResumeSchema,
  CareerProfile,
  CareerProfileSchema,
} from "@resume-buddy/schemas";

const config : GenerateContentConfig = {
  systemInstruction: SYSTEM_INSTRUCTION.CAREER_PROFILE_BUILD,
  thinkingConfig : {
    thinkingLevel: ThinkingLevel.HIGH,
  }
};

export async function buildCareerProfile(resume: Resume): Promise<CareerProfile> {
  const validatedResume = ResumeSchema.parse(resume);
  // create Gemini AI client
  const ai = createGeminiClient();
  // prepare inputs for the engine
  const inputs: EngineInput[] = [{ type: "metadata", value: validatedResume }];
  const result = await runEngine({
    ai,
    model: "gemini-3-flash-preview",
    inputs,
    config,
  });
  // validate AI output
  const cleanedResult = safeParseAIJson<CareerProfile>(result);
  return CareerProfileSchema.parse(cleanedResult);
}
