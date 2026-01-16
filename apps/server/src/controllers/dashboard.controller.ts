import { getDashboardDataService } from "../services/dashboard.service.js";
import { Request, Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiError, ApiResponse } from "@resume-buddy/utils";

export const getDashboardDataController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const dashboardData = await getDashboardDataService(userId);

  if (!dashboardData) {
    throw new ApiError(500, "Failed to retrieve dashboard data");
  }

  res
  .status(200)
  .json(new ApiResponse(dashboardData, "Dashboard data retrieved successfully", 200));
});
