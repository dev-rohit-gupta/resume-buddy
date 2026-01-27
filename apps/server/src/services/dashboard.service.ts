import { getCareerStatsService } from "./CareerInsights.service.js";
import { getResumeByUserIdService } from "./resume.service.js";
import { calcAtsScore } from "@resume-buddy/utils";
import { ApiError } from "@resume-buddy/utils";
/**
 *
 * @param userId
 * @returns
 */
export async function getDashboardDataService(userId: string) {
  const [resume, careerInsights] = await Promise.all([
    getResumeByUserIdService(userId),
    getCareerStatsService(userId),
  ]);

  if (!resume) new ApiError(404,"resume not found",false);
  if (!careerInsights) new ApiError(404,"careerInsights not found",false);
  const atsScore = calcAtsScore(resume.atsAnalysis);
  return {
    user: careerInsights?.user,
    resume: {
      url: resume.url,
      version: resume.version,
    },
    career: {
      atsScore,
      bestRole: resume.bestRole,
      nearestNextRole: resume.nearestNextRole,
      skillGaps: resume.skillGaps,
    },
    jobStats: {
      total: careerInsights?.totalMatched ?? 0,
      thisWeek: careerInsights?.thisWeekMatched ?? 0,
      previousWeek: careerInsights?.previousWeekMatched ?? 0,
    },
  };
}
