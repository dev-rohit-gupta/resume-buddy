import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import suggestionRoute from "./sugestion.route.js";
import resumeRouter from "./resume.route.js";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../controllers/profile.controller.js";

const router = Router();
// Apply authentication middleware to all  routes
router.use(authMiddleware);
// ---- ME ROUTES ----
const meRouter = Router();

// profile
meRouter
  .route("/")
  .get(getUserProfileController)
  .put(updateUserProfileController);

// sub-resources
meRouter.use("/suggestions", suggestionRoute);
meRouter.use("/resume", resumeRouter);

// mount the /me router
router.use("/me", meRouter);

export default router;
