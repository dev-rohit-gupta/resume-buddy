import { Router } from "express";
import {
  suggestionController,
  getUserSuggestionsController,
  getSuggestionByIdController,
  removeSuggestionByIdController,
} from "../controllers/suggestion.controller.js";

const router = Router();

router.post("/generate", suggestionController);
router.get("/:id", getSuggestionByIdController);
router.delete("/:id", removeSuggestionByIdController);
router.get("", getUserSuggestionsController);

export default router;
