import { ResumeModel } from "../models/resume.model.js";
import { ApiResponse, ApiError } from "@resume-buddy/utils";
import { Request, Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import {
  getResumeByUserIdService,
  updateResumeService,
  updateResumeFileService,
} from "../services/resume.service.js";

export const getResumeController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const resume = await getResumeByUserIdService(userId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  res.status(200).json(new ApiResponse({ resume }, "Resume fetched successfully"));
});

export const updateResumeController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const newContent = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!Object.keys(newContent).length) {
    throw new ApiError(400, "No fields to update");
  }

  const updatedResume = await updateResumeService(userId, newContent);

  if (!updatedResume) {
    throw new ApiError(404, "Resume not found");
  }

  res.status(200).json(new ApiResponse({ updatedResume }, "Resume updated successfully"));
});

export const updateResumeFileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const file = req.file;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!file) throw new ApiError(400, "No file uploaded");

  const updatedResume = await updateResumeFileService(userId, file);

  if (!updatedResume) throw new ApiError(404, "Resume not found");

  res.status(200).json(new ApiResponse({ updatedResume }, "Resume file updated successfully"));
});
