import { Request, Response } from "express";
import { logoutService } from "../services/logout.service.js";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiResponse } from "@resume-buddy/utils";

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    logoutService(req, res);
    res.status(200).json(new ApiResponse("Logout successful"));
});