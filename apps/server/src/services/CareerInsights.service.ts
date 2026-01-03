import { JobStatsModel } from "../models/jobStats.model.js";
import { ApiError } from "@resume-buddy/utils";

export async function getCareerStatsService(userId: string) {
  let jobStats = await JobStatsModel.findOne({ user: userId })
    .select(
      ` createdAt
        updatedAt
        totalMatched
        thisWeekMatched 
        previousWeekMatched
        `
    )
    .lean();
  return jobStats;
}
export async function updateCareerInsightsService(
  userId: string,
  incriments: { totalMatched: number; thisWeekMatched: number; previousWeekMatched: number }
) {
  const updatedJobStats = await JobStatsModel.findOneAndUpdate(
    { user: userId },
    {
      $inc: {
        totalMatched: incriments.totalMatched,
        thisWeekMatched: incriments.thisWeekMatched,
        previousWeekMatched: incriments.previousWeekMatched,
      },
      $setOnInsert: { user: userId, totalMatched: 0, thisWeekMatched: 0, previousWeekMatched: 0 },
    },
    { new: true, upsert: true }
  ).lean();

  if (!updatedJobStats) throw new ApiError(500, "Failed to update career insights");

  return updatedJobStats;
}
