import { Request, Response, NextFunction } from "express";
import { ApiError } from "@resume-buddy/utils";
import { jwtVerify } from "jose";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  const encoder = new TextEncoder();
  const encodedSecret = encoder.encode(process.env.ACCESS_TOKEN_SECRET!);
  const { payload } = await jwtVerify<{ id: string; role: "user" | "admin" }>(token, encodedSecret);
  
  req.user = {
    id: payload.id,
    role: payload.role, 
  };

  next();
}
