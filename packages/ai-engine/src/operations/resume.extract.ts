import { createGeminiClient } from "../client/gemini.client.js";
import { runEngine } from "../engine/run.engine.js";
import { ResumeSchema, Resume } from "@resume-buddy/schemas";
import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { EngineInput } from "@resume-buddy/schemas";
import { safeParseAIJson } from "@resume-buddy/utils";
import { GenerateContentConfig, ThinkingLevel } from "@google/genai";

const config  : GenerateContentConfig = {
  systemInstruction: SYSTEM_INSTRUCTION.RESUME_EXTRACTION,
  thinkingConfig : {
    thinkingLevel: ThinkingLevel.MINIMAL,
  }
};

export async function analyzeResume(
  text?: string,
  file?: { buffer: Buffer; mimeType: string },
  metadata?: Record<string, unknown>
) {
  // create Gemini AI client
  const ai = createGeminiClient();

  if (!text && !file && !metadata) {
    throw new Error("one parameter is required");
  }
  const inputs: EngineInput[] = [];

  if (text) inputs.push({ type: "text", value: text });
  if (file) inputs.push({ type: "file", buffer: file.buffer, mimeType: file.mimeType });
  if (metadata) inputs.push({ type: "metadata", value: metadata });
  const result = await runEngine({
    ai,
    model: "gemini-3-flash-preview",
    inputs,
    config,
  });
  const cleanedResult = safeParseAIJson<Resume>(result);
  return ResumeSchema.parse(cleanedResult);
}
