import { getCareerStatsService } from "./CareerInsights.service.js";
import { getResumeByUserIdService } from "./resume.service.js";

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

  return {
    user : careerInsights?.user,
    resume: {
      url: resume.url,
      version: resume.version,
    },
    career: {
      atsScore: resume.atsScore,
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

