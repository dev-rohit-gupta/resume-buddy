import { createGeminiClient } from "../client/gemini.client.js";
import { runEngine } from "../engine/run.engine.js";
import { ResumeSchema } from "@resume-buddy/schemas";
import { AI_ENGINE_CONFIG } from "../ai-engine.config.js";
import { SYSTEM_INSTRUCTION } from "../prompts/system.prompt.js";
import { EngineInput } from "@resume-buddy/schemas";

// create Gemini AI client
const ai = createGeminiClient();

export async function analyzeResume(
  text?: string,
  file?: { buffer: Buffer; mimeType: string },
  metadata?: Record<string, unknown>
) {
  if (!text && !file && !metadata) {
    throw new Error("one parameter is required");
  }
  const inputs: EngineInput[] = [];

  if (text) inputs.push({ type: "text", value: text });
  if (file) inputs.push({ type: "file", buffer: file.buffer, mimeType: file.mimeType });
  if (metadata) inputs.push({ type: "metadata", value: metadata });
  const result = await runEngine({
    ai,
    systemInstruction: SYSTEM_INSTRUCTION.RESUME_EXTRACTION,
    inputs,
    config: AI_ENGINE_CONFIG,
  });
  return ResumeSchema.parse(result);
}
