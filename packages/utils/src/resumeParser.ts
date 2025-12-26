import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { getResumeConfidenceScore } from "./getResumeConfidenceScore.js";

async function parsePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse(buffer);
  const data = await parser.getText();
  return data.text;
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Parse a resume file and extract its text content along with a confidence score.
 */
export async function parseResume({
  file,
  mimeType,
}: {
  file: Buffer;
  mimeType: string;
}): Promise<{ text: string; confidenceScore: number }> {
  let text: string;

  if (mimeType === "application/pdf") {
    text = await parsePdf(file);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    text = await parseDocx(file);
  } else {
    throw new Error("Unsupported file type");
  }

  const confidenceScore = getResumeConfidenceScore(text);
  return { text, confidenceScore };
}
