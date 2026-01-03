import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import suggestionRoute from "./sugestion.route.js";
import resumeRouter from "./resume.route.js";
import dashboardRouter from "./dasboard.route.js";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../controllers/profile.controller.js";

const router = Router();
// Apply authentication middleware to all  routes
router.use(requireAuth);
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
meRouter.use("/dashboard", dashboardRouter);

// mount the /me router
router.use("/me", meRouter);

export default router;
