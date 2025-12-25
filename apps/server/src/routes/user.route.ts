import { Router } from "express";
import { loginController } from "../controllers/login.controller.js";
import { logoutController } from "../controllers/logout.controller.js";
import { signupController } from "../controllers/signup.controller.js";
import { uploader } from "../middleware/multer.middleware.js";

const router = Router();

// POST /api/auth/login
router.route("/login").post(loginController);

// POST /api/auth/signup
router.route("/signup").post(uploader.single("file"), signupController);

// POST /api/auth/logout
router.route("/logout").post(logoutController);

export default router;
