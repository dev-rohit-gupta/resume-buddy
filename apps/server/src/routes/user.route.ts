import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import suggestionRoute from "./sugestion.route.js";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../controllers/profile.controller.js";

const router = Router();
router.use(authMiddleware);
// GET /api/users/profile & PUT /api/users/profile
router
  .route("/me")
  .get(getUserProfileController)
  .put(updateUserProfileController);

// Suggestion routes
router.use(suggestionRoute);


export default router;
