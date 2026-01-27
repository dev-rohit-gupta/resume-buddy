import { JobStatsModel } from "../models/jobStats.model.js";
import { ApiError } from "@resume-buddy/utils";

export async function getCareerStatsService(userId: string) {
  let jobStats = await JobStatsModel.findOne({ user: userId })
    .select(
      ` user
        createdAt
        updatedAt
        totalMatched
        thisWeekMatched 
        previousWeekMatched
        `
    )
    .populate({ path: "user", select: "name email avatar role" })
    .lean();
    
  return jobStats;
}
export async function updateCareerInsightsService(
  userId: string,
  increments: { totalMatched: number; thisWeekMatched: number; previousWeekMatched: number }
) {
  const updatedJobStats = await JobStatsModel.findOneAndUpdate(
    { user: userId },
    {
      $inc: {
        totalMatched: increments.totalMatched,
        thisWeekMatched: increments.thisWeekMatched,
        previousWeekMatched: increments.previousWeekMatched,
      },
      $setOnInsert: { user: userId, totalMatched: 0, thisWeekMatched: 0, previousWeekMatched: 0 },
    },
    { new: true, upsert: true }
  ).lean();

  if (!updatedJobStats) throw new ApiError(500, "Failed to update career insights");

  return updatedJobStats;
}
