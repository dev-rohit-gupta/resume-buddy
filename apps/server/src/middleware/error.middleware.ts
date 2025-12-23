import { ApiError } from "@resume-buddy/utils";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Unknown / crash error
  console.error("🔥 Unexpected Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
}
