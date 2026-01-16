import { Request, Response } from "express";
import { logoutService } from "../services/logout.service.js";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiResponse } from "@resume-buddy/utils";

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  logoutService(req, res);
  const statusCode = 204;
  res.status(statusCode).json(new ApiResponse(undefined ,"Logout successful", statusCode));
});
