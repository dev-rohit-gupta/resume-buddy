import { ResumeModel } from "../models/resume.model.js";
import { Resume } from "@resume-buddy/schemas";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary.service.js";
import { deepMerge } from "@resume-buddy/utils";
/**
 * Get resume by user ID
 */
export async function getResumeByUserIdService(userId: string) {
  const resume = await ResumeModel.findOne({ user: userId }).select("content version url").lean();
  if (!resume) throw new Error("Resume not found");
  return resume;
}
/**
 * Update resume content by merging new content with existing content
 */
export async function updateResumeContentService(userId: string, newContent: Partial<Resume>) {
  if (!Object.keys(newContent).length) {
    throw new Error("No fields to update");
  }

  const resume = await ResumeModel.findOne({ user: userId });

  if (!resume) {
    throw new Error("Resume not found");
  }

  const mergedContent = deepMerge<Resume>(resume.content ?? {}, newContent);

  const updatedResume = await ResumeModel.findOneAndUpdate(
    { _id: resume._id },
    {
      $set: { content: mergedContent },
      $inc: { version: 1 },
    },
    {
      new: true,
      projection: {
        content: 1,
        version: 1,
        url: 1,
      },
    }
  ).lean();

  return updatedResume;
}

export async function updateResumeFileService(userId: string, file: Express.Multer.File) {
  // Find existing resume
  const resume = await ResumeModel.findOne({ user: userId }).select("id url version");
  if (!resume) {
    throw new Error("Resume not found");
  }
  // Delete old resume from Cloudinary
  await deleteFromCloudinary(resume.id);
  // Upload new resume to Cloudinary
  const { url, id } = await uploadToCloudinary(file.buffer, "resumes");
  if (!url || !id) {
    throw new Error("File upload failed");
  }
  // Update resume document
  resume.url = url;
  resume.id = id;
  resume.version += 1;
  // Save updated resume
  await resume.save();

  return resume;
}
