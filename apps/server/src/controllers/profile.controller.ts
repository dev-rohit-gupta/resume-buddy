import { ApiResponse } from "@resume-buddy/utils";
import { Request, Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { getUserProfileService } from "../services/profile.service.js";

export const getUserProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userProfile = await getUserProfileService(userId);
  res.status(200).json(new ApiResponse({ userProfile }, "User profile fetched successfully"));
});
