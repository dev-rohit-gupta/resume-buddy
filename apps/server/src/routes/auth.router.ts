import { Router } from "express";
import { loginController } from "../controllers/login.controller.js";
import { logoutController } from "../controllers/logout.controller.js";
import { signupController } from "../controllers/signup.controller.js";
import { uploader } from "../middleware/multer.middleware.js";

const router = Router();

// POST /api/users/login
router.route("/login").post(loginController);

// POST /api/users/signup
router.route("/signup").post(uploader.single("file"), signupController);

// POST /api/users/logout
router.route("/logout").post(logoutController);


export default router;
