import { UserModel } from "../models/user.model.js";
import { ResumeModel } from "../models/resume.model.js";
import { ApiError } from "@resume-buddy/utils";
import { uploadToCloudinary } from "./cloudinary.service.js";
import { extractResumeService } from "./resumeExtraction.service.js";

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
  // Upload resume to Cloudinary
  const resumeInfoFromCloudinary = await uploadToCloudinary(resume, "resumes");
  if (!resumeInfoFromCloudinary) {
    throw new ApiError(500, "File upload failed");
  }
  // extract from resume
  const resumeData = await extractResumeService(resume);

  // Create a new user
  const newUser = new UserModel({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    ...(avatar && { avatar }), // only include avatar if provided else use defaul
  });

  // Create a new resume document
  const newResume = new ResumeModel({
    user: newUser._id,
    id: resumeInfoFromCloudinary.id,
    resourceType :resumeInfoFromCloudinary.resourceType ,
    extension : resumeInfoFromCloudinary.extension,
    content: resumeData,
    version: 1,
  });
  // Save the new resume to the database
  await newResume.save();

  // Save the new user to the database
  await newUser.save();

  const accessToken = await newUser.generateAccessToken();
  return {
    accessToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      avatar: newUser.avatar,
    },
  };
}
