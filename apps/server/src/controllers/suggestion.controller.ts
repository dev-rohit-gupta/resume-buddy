import { ApiError, ApiResponse } from "@resume-buddy/utils";
import { Request, Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { AIInputSchema } from "@resume-buddy/schemas";
import {
  suggestionService,
  getUserSuggestionsService,
  getSuggestionByIdService,
  removeSuggestionByIdService,
} from "../services/suggestion.service.js";

/**
 * Controller to handle job suggestion requests.
 * It analyzes the job data provided in the request body
 * and returns AI-generated suggestions based on the user's resume.
 */
export const suggestionController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const jobData = AIInputSchema.safeParse(req.body);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!jobData.success) {
    throw new ApiError(400, `Invalid job data: ${jobData.error.message}`);
  }

  const analysisResult = await suggestionService(userId, jobData.data);
  res.status(201).json(new ApiResponse({ analysisResult }, "Job analyzed successfully"));
});
/**
 * Controller to fetch paginated user suggestions.
 * It retrieves suggestions based on the authenticated user's ID,
 * with support for pagination through query parameters.
 */
export const getUserSuggestionsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const query = req.query.q?.toString() || "";

  // Validate page and limit
  if (isNaN(page) || page < 1) {
    throw new ApiError(400, "Invalid page number");
  }
  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ApiError(400, "Invalid limit number");
  }
  // adding security to prevent too large limit
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const suggestions = await getUserSuggestionsService(userId, page, safeLimit, query);
  res.status(200).json(new ApiResponse({ suggestions }, "User suggestions fetched successfully"));
});
/**
 * Controller to fetch a specific suggestion by its ID.
 * It retrieves the suggestion details for the authenticated user.
 */
export const getSuggestionByIdController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const suggestionId = req.params.id?.toString();

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!suggestionId) throw new ApiError(400, "Suggestion ID is required");
  // Fetch the suggestion using the service
  const suggestion = await getSuggestionByIdService(userId, suggestionId);

  res.status(200).json(new ApiResponse({ suggestion }, "Suggestion fetched successfully"));
});
export const removeSuggestionByIdController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const suggestionId = req.params.id;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!suggestionId) throw new ApiError(400, "Suggestion ID is required");
  // Remove the suggestion
  const result = await removeSuggestionByIdService(userId, suggestionId);

  res.status(200).json(new ApiResponse({}, "Suggestion removed successfully"));
});
