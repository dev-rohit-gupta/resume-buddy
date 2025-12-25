import { logoutController } from "../controllers/logout.controller.js";
import { Router } from "express";

const router = Router();

router.post("/logout", logoutController);

export default router;