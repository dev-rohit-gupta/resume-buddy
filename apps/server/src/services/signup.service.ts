import { UserModel } from "../models/user.model.js";
import { ResumeModel } from "../models/resume.model.js";
import { ApiError } from "@resume-buddy/utils";
import { extractResumeService } from "./resumeExtraction.service.js";
import { buildCareerProfile } from "@resume-buddy/ai-engine";
import { JobStatsModel } from "../models/jobStats.model.js";
import { uploadToS3 } from "./aws.service.js";
import { generateResumeKey } from "@resume-buddy/utils";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  resume: Express.Multer.File;
}

export async function signupService({ name, email, password, avatar, resume }: SignupInput) {
  // Check if a user with the given email already exists
  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // extract from resume
  const resumeData = await extractResumeService(resume);
  if (!resumeData) {
    throw new ApiError(500, "Resume extraction failed");
  }
  const careerProfile = await buildCareerProfile(resumeData);
  if (!careerProfile) {
    throw new ApiError(500, "Career profile building failed");
  }
  // Create a new user
  const newUser = new UserModel({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    ...(avatar && { avatar }), // only include avatar if provided else use default
  });

  // Initialize job stats for the new user
  const newJobStats = new JobStatsModel({
    user: newUser._id,
    totalMatched: 0,
    thisWeekMatched: 0,
    previousWeekMatched: 0,
  });
  await newJobStats.save();

  // Get user's resume key
  const newUserId = newUser._id.toString();
  const resumeKey = generateResumeKey(newUserId,resume.originalname);
  // Upload resume to S3
  const response = await uploadToS3(resume, resumeKey);
  if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode >= 300) {
    throw new ApiError(500, "File upload failed");
  }

  // Create a new resume document
  const newResume = new ResumeModel({
    user: newUser._id,
    key: resumeKey,
    resourceType: "raw",
    content: resumeData,
    version: 1,
    ...careerProfile,
  });
  // Save the new resume to the database
  await newResume.save();

  // Save the new user to the database
  await newUser.save();

  const accessToken = await newUser.generateAccessToken();
  return {
    accessToken,
    user: {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      avatar: newUser.avatar,
    },
  };
}
