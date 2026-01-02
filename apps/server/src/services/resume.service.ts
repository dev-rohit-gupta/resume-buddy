import { ResumeModel } from "../models/resume.model.js";
import { Resume } from "@resume-buddy/schemas";
import { uploadToCloudinary, deleteFromCloudinary ,getResumeUrl} from "./cloudinary.service.js";
import { ApiError, deepMerge } from "@resume-buddy/utils";
/**
 * Get resume by user ID
 */
export async function getResumeByUserIdService(userId: string) {
  const resume = await ResumeModel.findOne({ user: userId }).select("content id extension resourceType").lean();
  if (!resume) throw new Error("Resume not found");
  const resumeUrl = getResumeUrl(resume.id, resume.extension );
  return { ...resume, url: resumeUrl };
}

/**
 * Update resume content by merging new content with existing content
 */
export async function updateResumeContentService(userId: string, newContent: Partial<Resume>) {
  if (!Object.keys(newContent).length) {
    throw new ApiError(400, "No fields to update");
  }

  const resume = await ResumeModel.findOne({ user: userId });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
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
        id: 1,
        extension: 1,
      },
    }
  ).lean();
  const resumeUrl = getResumeUrl(updatedResume!.id, updatedResume!.extension );
  return {...updatedResume, url: resumeUrl};
}

export async function updateResumeFileService(userId: string, file: Express.Multer.File) {
  // Find existing resume
  const resume = await ResumeModel.findOne({ user: userId }).select("id content extension resourceType version");
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }
  // Delete old resume from Cloudinary
  await deleteFromCloudinary(resume.id);
  // Upload new resume to Cloudinary
  const { id, extension ,resourceType } = await uploadToCloudinary(file, "resumes");
  if (!id) {
    throw new ApiError(500, "File upload failed");
  }
  // Update resume document
  resume.extension = extension;
  resume.resourceType = resourceType;
  resume.id = id;
  resume.version += 1;
  // Save updated resume
  await resume.save();

  return resume;
}
