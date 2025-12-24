import { Request,Response } from "express";
import { loginService } from "../services/login.service.js";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiError } from "@resume-buddy/utils";
import { ApiResponse } from "@resume-buddy/utils";
import { cookieOptions } from "../config/config.js";

export const authController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(new ApiError(400, "Email and password are required"));
    }
    // Call login service
    const result = await loginService({ email, password });

    // Set access token in HTTP-only cookie
    res.cookie("accessToken", result.token, cookieOptions);


    res.status(200).json(new ApiResponse(result, "Login successful"));
});
