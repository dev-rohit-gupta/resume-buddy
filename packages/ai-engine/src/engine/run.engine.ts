import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import type { AIEngineConfig } from "../ai-engine.config.js";

interface RunEngineParams {
  ai: InstanceType<typeof GoogleGenAI>;
  prompt: string;
  config: AIEngineConfig;
}

/**
 *  Run the AI engine with the given prompt and configuration.
 * @returns The generated content from the AI engine.
 */
export async function runEngine({ ai, prompt, config }: RunEngineParams) {
  const response = await ai.models.generateContent({
    model: config.model ?? "gemini-1.5-flash",
    contents: prompt,
    ...config.generation,
  });

  if (!response?.text) {
    throw new Error("Empty AI response");
  }

  return response.text;
}
