import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  suggestionController,
  getUserSuggestionsController,
  getSuggestionByIdController,
  removeSuggestionByIdController,
} from "../controllers/suggestion.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/suggestions/generate", suggestionController);
router.get("/suggestions/:id", getSuggestionByIdController);
router.delete("/suggestions/:id", removeSuggestionByIdController);
router.get("/suggestions", getUserSuggestionsController);

export default router;
