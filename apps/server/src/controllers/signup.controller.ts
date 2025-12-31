import { Request, Response } from "express";
import { signupService } from "../services/signup.service.js";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiError } from "@resume-buddy/utils";
import { ApiResponse } from "@resume-buddy/utils";
import { cookieOptions } from "../config/cookie.config.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { emailSchema } from "@resume-buddy/schemas";
import { analyzeResume } from "@resume-buddy/ai-engine";
import z from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body || req.params;
  const parsedBody = signupSchema.safeParse(data);
  if (!parsedBody.success) {
    const errors = parsedBody.error.message.replaceAll("\n", ", ");
    throw new ApiError(400, `Invalid input: ${errors}`);
  }
  const { name, email, password } = parsedBody.data;

  const resume = req.file;
  if (!resume) {
    throw new ApiError(400, "resume is required");
  }

  // parse the resume
  const { accessToken, user } = await signupService({ name, email, password, resume });
  res.cookie("accessToken", accessToken, cookieOptions);
  res.status(201).json(new ApiResponse({ user }, "User registered successfully"));
});
