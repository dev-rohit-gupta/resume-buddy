import { CandidateLevel } from "@resume-buddy/schemas";

// infer candidate level from resume text
function inferCandidateLevel(text: string): CandidateLevel {
  const lower = text.toLowerCase();

  if (
    lower.includes("intern") ||
    lower.includes("student") ||
    lower.includes("b.tech") ||
    lower.includes("bachelor") ||
    lower.includes("college") ||
    lower.includes("semester")
  ) {
    return "student";
  }

  if (lower.includes("experience") || lower.includes("company")) {
    return "experienced";
  }

  return "fresher";
}

// confidence calculation for student candidates
function studentConfidence(text: string): number {
  let score = 0;

  if (/education|college|university|b\.tech|degree/i.test(text)) score += 0.4;
  if (/project|mini project|assignment/i.test(text)) score += 0.3;
  if (/skills|technologies|tools/i.test(text)) score += 0.2;
  if (text.length > 600) score += 0.1;

  return Math.min(score, 1);
}

// confidence calculation for fresher candidates
function fresherConfidence(text: string): number {
  let score = 0;

  if (/education/i.test(text)) score += 0.3;
  if (/internship|training|project/i.test(text)) score += 0.3;
  if (/skills/i.test(text)) score += 0.2;
  if (text.length > 800) score += 0.2;

  return Math.min(score, 1);
}

// confidence calculation for experienced candidates
function experiencedConfidence(text: string): number {
  let score = 0;

  if (/experience|company|role/i.test(text)) score += 0.4;
  if (/skills|technologies/i.test(text)) score += 0.2;
  if (/education/i.test(text)) score += 0.1;
  if (text.length > 1200) score += 0.3;

  return Math.min(score, 1);
}
/**
 * Get the confidence score of a resume based on its content.
 * @param text - The text content of the resume.
 * @returns A confidence score between 0 and 1.
 */
export function getResumeConfidenceScore(text: string): number {
  const level = inferCandidateLevel(text);

  let confidence = 0;

  if (level === "student") confidence = studentConfidence(text);
  if (level === "fresher") confidence = fresherConfidence(text);
  if (level === "experienced") confidence = experiencedConfidence(text);
  return confidence;
}
