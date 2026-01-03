import { getDashboardDataController } from "../controllers/dashboard.controller.js";
import { Router } from "express";

const router = Router();

// Dashboard route
router.get("/", getDashboardDataController);

export default router;