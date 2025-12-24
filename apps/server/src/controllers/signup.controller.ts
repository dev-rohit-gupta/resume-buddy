import { Request, Response } from "express";
import { signupService } from "../services/signup.service.js";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiError } from "@resume-buddy/utils";
import { ApiResponse } from "@resume-buddy/utils";
import { cookieOptions } from "../config/config.js";

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }
  const { accessToken, user } = await signupService({ name, email, password });
  res.cookie("accessToken", accessToken, cookieOptions);
  res.status(201).json(new ApiResponse({ user }, "User registered successfully"));
});
