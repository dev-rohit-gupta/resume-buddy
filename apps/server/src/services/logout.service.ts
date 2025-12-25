import { Request, Response } from "express";
import { cookieOptions } from "../config/config.js";

export function logoutService(req: Request, res: Response): void {
    res.clearCookie("accessToken", cookieOptions);
}
