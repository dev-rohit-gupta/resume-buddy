import { Resume, ResumeSchema } from "@resume-buddy/schemas";
import { analyzeResume } from "@resume-buddy/ai-engine";
import { parseResume } from "@resume-buddy/utils";

export async function extractResumeService(resume: Express.Multer.File): Promise<Resume> {
  // Parse the resume
  const { text: ResumeText, confidenceScore } = await parseResume({
    file: resume.buffer,
    mimeType: resume.mimetype,
  });

  // analyzing resume on the basis of confidence score
  let resumeJson;
  if (confidenceScore >= 0.7) {
    // text only analysis
    resumeJson = await analyzeResume(ResumeText);
  } else {
    // as resume parsing confidence is low, provide the file buffer for better analysis
    resumeJson = await analyzeResume(ResumeText, {
      buffer: resume.buffer,
      mimeType: resume.mimetype,
    });
  }

  return ResumeSchema.parse(resumeJson);
}
