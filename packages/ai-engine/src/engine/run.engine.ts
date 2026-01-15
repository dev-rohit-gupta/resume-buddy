import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import type { AIEngineConfig } from "../ai-engine.config.js";
import { EngineInput } from "@resume-buddy/schemas";
import { mapInputsToContents } from "@resume-buddy/utils";

interface RunEngineParams {
  ai: InstanceType<typeof GoogleGenAI>;
  inputs: EngineInput[];
  config: AIEngineConfig;
  systemInstruction: string;
}

/**
 *  Run the AI engine with the given prompt and configuration.
 * @returns The generated content from the AI engine.
 */
export async function runEngine({
  ai,
  systemInstruction,
  inputs,
  config,
}: {
  ai: InstanceType<typeof GoogleGenAI>;
  inputs: EngineInput[];
  config: AIEngineConfig;
  systemInstruction: string;
}) {
  const contents = mapInputsToContents(inputs);

  const response = await ai.models.generateContent({
    model: process.env.GOOGLE_AI_MODEL ?? "gemini-1.0-pro",
    contents,
    config: {
      systemInstruction,
      ...config.generation,
    },
  });

  if (!response?.text) {
    throw new Error("Empty AI response");
  }

  return response.text;
}
