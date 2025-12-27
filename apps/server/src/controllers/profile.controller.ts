import { ApiResponse } from "@resume-buddy/utils";
import { Request, Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { getUserProfileService, updateUserProfileService } from "../services/profile.service.js";
import { UserModel } from "../models/user.model.js";

export const getUserProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userProfile = await getUserProfileService(userId);
  res.status(200).json(new ApiResponse({ userProfile }, "User profile fetched successfully"));
});

export const updateUserProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updateData: Partial<typeof UserModel> = req.body;
  const updatedProfile = await updateUserProfileService(userId, updateData);
  res.status(200).json(new ApiResponse({ updatedProfile }, "User profile updated successfully"));
});
