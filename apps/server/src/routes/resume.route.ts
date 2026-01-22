import { Router } from "express";
import { uploader } from "../middleware/multer.middleware.js";
import { downloadResumeFileController } from "../controllers/resume.controller.js";
import {
  getResumeController,
  updateResumeController,
  updateResumeFileController,
} from "../controllers/resume.controller.js";

const router = Router();

// Get resume & Update resume content
router.route("/").get(getResumeController).put(updateResumeController);

// Update resume file
router
  .route("/file")
  .get(downloadResumeFileController)
  .put(uploader.single("file"), updateResumeFileController);

export default router;
