import { ResumeModel } from "../models/resume.model.js";
import type { ResumeDb } from "@resume-buddy/schemas";
import { ApiError, deepMerge } from "@resume-buddy/utils";
import { extractResumeService } from "./resumeExtraction.service.js";
import { buildCareerProfile } from "@resume-buddy/ai-engine";
import { UpdateQuery } from "mongoose";
import { uploadToS3 , getS3Object } from "./aws.service.js";
/*-------------- Constants -----------------*/
const resumeUrl = "me/resume";


export async function getResumeKey(userId : string ){
  const resume = await ResumeModel.findOne({ user: userId }).select("key").lean();
  if(!resume) throw new ApiError(404, "Resume not found");
  return resume.key;
}


/**
 * Get resume by user ID
 */
export async function getResumeByUserIdService(userId: string) {
  // Find resume document by user ID
  const resume = await ResumeModel.findOne({ user: userId })
    .select("content key extension resourceType atsScore bestRole nearestNextRole skillGaps version")
    .lean();

  if (!resume) throw new ApiError(404, "Resume not found");

  return { ...resume, url: resumeUrl };
}

/**
 * Update resume content by merging new content with existing content
 */
export async function updateResumeService(userId: string, partialData: Partial<ResumeDb>) {
  // Check if there are any effective updates
  const hasEffectiveUpdate = Object.values(partialData).some(
    (v) => v && (typeof v !== "object" || Object.keys(v).length > 0)
  );

  if (!hasEffectiveUpdate) {
    throw new ApiError(400, "No fields to update");
  }

  // Fetch existing resume document
  const resumeDoc = await ResumeModel.findOne({ user: userId }).lean();
  if (!resumeDoc) throw new ApiError(404, "Resume not found");

  // Remove internal MongoDB fields
  const { _id, createdAt, updatedAt, __v, user, ...safeResume } = resumeDoc;

  // Deep merge existing resume with partial data
  const merged = deepMerge<any>(safeResume, partialData);
  let careerProfile = {};

  // Generate career profile if content is provided
  if (partialData.content && merged.content) {
    careerProfile = await buildCareerProfile(merged.content);
  }

  // Determine if version should be incremented
  const shouldBumpVersion =
    !!partialData.content ||
    !!partialData.extension ||
    !!partialData.resourceType ||
    !!partialData.key;

  // Prepare update query
  const updateSet: UpdateQuery<any> = {
    $set: {
      content: merged.content,
      extension: merged.extension,
      resourceType: merged.resourceType,
      key: merged.key,
      ...careerProfile,
    },
  };

  // Increment version if necessary
  if (shouldBumpVersion) {
    updateSet["$inc"] = { version: 1 };
  }

  // Update resume document in database
  const updatedResume = await ResumeModel.findOneAndUpdate({ _id }, updateSet, {
    new: true,
    projection: {
      content: 1,
      version: 1,
      id: 1,
      extension: 1,
      resourceType: 1,
    },
  })
    .select("key content extension resourceType version")
    .lean();

  return { ...updatedResume, url: resumeUrl };
}

/**
 * Update resume file by uploading new file to Cloudinary
 */
export async function updateResumeFileService(userId: string, file: Express.Multer.File ) {
  // Find existing resume
  const resume = await ResumeModel.findOne({ user: userId }).lean();
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }
  const resumeKey = resume.key;
  // Remove internal MongoDB fields
  const { _id, createdAt, updatedAt, __v, user, ...safeResume } = resume;

  // Upload new resume to S3 it will overwrite existing file
  const response = await uploadToS3(file,resumeKey );
  if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode >= 300) {
    throw new ApiError(500, "File upload failed");
  }
  const resourceType = "raw"; // Since we are uploading resume files
  // Extract content from uploaded file
  const extractedContent = await extractResumeService(file);
  if (!extractedContent) {
    throw new ApiError(500, "Resume extraction failed");
  }

  // Generate career profile from extracted content
  const careerProfile = await buildCareerProfile(extractedContent);

  // Update resume document
  const updatedResume = await ResumeModel.findOneAndUpdate(
    { _id: resume._id },
    {
      $set: {
        content: extractedContent,
        resourceType,
        key: resumeKey,
        ...careerProfile,
      },
      $inc: { version: 1 },
    },
    {
      new: true,
      projection: {
        content: 1,
        version: 1,
        key: 1,
        resourceType: 1,
      },
    }
  )
    .select("key content resourceType version")
    .lean();

  return { ...updatedResume, url: resumeUrl };
}


export async function downloadResumeFileService(userId: string, range?: string) {
  // Find existing resume
  const resumeKey = await getResumeKey(userId);
  
  // Get resume file from S3
  const s3Object = await getS3Object(resumeKey, range);
  if (!s3Object.$metadata.httpStatusCode || s3Object.$metadata.httpStatusCode >= 300) {
    throw new ApiError(404, "Resume file not found");
  }
  return s3Object;
}