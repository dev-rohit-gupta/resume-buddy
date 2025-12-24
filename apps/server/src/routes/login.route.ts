import { Router } from "express";
import { authController } from "../controllers/login.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", authController);

export default router;
