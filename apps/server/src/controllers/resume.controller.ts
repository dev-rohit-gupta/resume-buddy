import { ResumeModel } from "../models/resume.model.js";
import { ResumeDbSchema } from "@resume-buddy/schemas";
import { ApiResponse, ApiError } from "@resume-buddy/utils";
import { Request, Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { toNodeReadable } from "@resume-buddy/utils";
import {
  getResumeByUserIdService,
  updateResumeService,
  updateResumeFileService,
  downloadResumeFileService
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
  const newContent = ResumeDbSchema.partial().parse(req.body);

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

export const downloadResumeFileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // Ensure user is authenticated
  if (!userId) throw new ApiError(401, "Unauthorized");
  // range request support can be added later if needed
  const range = req.headers.range;
  const data = await downloadResumeFileService(userId, range);

  if (!data) throw new ApiError(404, "Resume file not found");

  // Headers set
  if (range) {
    res.status(206);
    res.setHeader("Content-Range", data.ContentRange!);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Length", data.ContentLength!);
  }

  res.setHeader("Content-Type", data.ContentType!);
  res.setHeader("Cache-Control", "no-store");

  const stream = toNodeReadable(data.Body);

  stream.pipe(res);
})