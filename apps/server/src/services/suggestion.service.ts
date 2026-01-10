import { UserModel } from "../models/user.model.js";
import { ResumeModel } from "../models/resume.model.js";
import { analyzeJob } from "@resume-buddy/ai-engine";
import { AIInput } from "@resume-buddy/schemas";
import { User } from "@resume-buddy/schemas";
import { SuggestionModel } from "../models/suggestion.model.js";
import { ApiError } from "@resume-buddy/utils";
import { JobStatsModel } from "../models/jobStats.model.js";
import { isSameWeek } from "@resume-buddy/utils";
// Fields to select when fetching suggestions
const suggestionAllowedFields = "id job aiResponse status createdAt -_id";

export async function suggestionService(userId: string, jobData: AIInput) {
  // Fetch user by ID
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  // Fetch the latest resume for the user
  const resume = await ResumeModel.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (!resume) {
    throw new ApiError(404, "Resume not found for the user");
  }

  // Prepare user info with resume content
  const userInfoWithResume: User = {
    ...user.toObject(),
    id: user.id,
    resume: resume.content,
  };

  // Analyze the job using the AI engine
  const analysisResult = await analyzeJob(userInfoWithResume, jobData);

  if (!analysisResult) {
    throw new ApiError(500, "Failed to analyze the job");
  }

  const isGoodMatch =
    analysisResult.stats.match === "Good" || analysisResult.stats.match === "Perfect";

  if (isGoodMatch) {
    const now = new Date();

    const stats = await JobStatsModel.findOne({ user: userId }).lean();
    const sameWeek = stats && isSameWeek(now, stats.updatedAt);

    await JobStatsModel.updateOne(
      { user: userId },
      sameWeek
        ? {
            $inc: {
              totalMatched: 1,
              thisWeekMatched: 1,
            },
          }
        : {
            $inc: {
              totalMatched: 1,
            },
            $set: {
              previousWeekMatched: stats?.thisWeekMatched ?? 0,
              thisWeekMatched: 1,
            },
          },
      { upsert: true }
    );
  }

  // create a new suggestion document
  const suggestion = new SuggestionModel({
    user: user._id,
    id: crypto.randomUUID(),
    job: jobData,
    status: "completed",
    aiResponse: analysisResult,
    resumeVersion: resume.version,
  });
  // Save the suggestion to the database
  await suggestion.save();

  return analysisResult;
}

export async function getUserSuggestionsService(userId: string, page = 1, limit = 10) {
  // Calculate skip value for pagination
  const skip = (page - 1) * limit;
  // Fetch suggestions with pagination
  const [suggestions, total] = await Promise.all([
    SuggestionModel.find({ user: userId })
      .select(suggestionAllowedFields)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SuggestionModel.countDocuments({ user: userId }),
  ]);

  // Prepare pagination metadata
  const meta = {
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: skip + limit < total,
    hasPrevPage: page > 1,
  };
  return { suggestions, meta };
}

export async function getSuggestionByIdService(userId: string, suggestionId: string) {
  // Fetch suggestion by ID and user ID
  const suggestion = await SuggestionModel.findOne({ id: suggestionId, user: userId })
    .select(suggestionAllowedFields)
    .lean();
  console.log({ userId, suggestionId, suggestion });
  if (!suggestion) {
    throw new ApiError(404, "Suggestion not found");
  }
  return suggestion;
}
export async function removeSuggestionByIdService(userId: string, suggestionId: string) {
  // Remove suggestion by ID and user ID
  const result = await SuggestionModel.deleteOne({ id: suggestionId, user: userId });
  if (result.deletedCount === 0) {
    throw new ApiError(404, "Suggestion not found or could not be deleted");
  }
}
