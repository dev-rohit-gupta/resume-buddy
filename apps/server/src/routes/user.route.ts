import { Router } from "express";
import { loginController } from "../controllers/login.controller.js";
import { logoutController } from "../controllers/logout.controller.js";
import { signupController } from "../controllers/signup.controller.js";
import { uploader } from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../controllers/profile.controller.js";

const router = Router();

// POST /api/users/login
router.route("/login").post(loginController);

// POST /api/users/signup
router.route("/signup").post(uploader.single("file"), signupController);

// POST /api/users/logout
router.route("/logout").post(logoutController);

// GET /api/users/profile & PUT /api/users/profile
router
  .route("/profile")
  .get(authMiddleware, getUserProfileController)
  .put(authMiddleware, updateUserProfileController);

export default router;
