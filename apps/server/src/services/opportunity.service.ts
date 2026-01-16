import { ApiError } from "@resume-buddy/utils";
import { OPPORTUNITY_API_BASE_URL } from "../config/opportunity.config.js";
import { Job, JobSchema } from "@resume-buddy/schemas";

type FilterOptions = {
  count?: number;
  geo?: string;
  industry?: string;
  tag?: string;
};

export async function getOpportunityService(options: FilterOptions = {}): Promise<Job[]> {
  // Validate and construct query parameters
  const url = new URL(OPPORTUNITY_API_BASE_URL);
  // Validate options
  Object.entries(options).forEach(([key, value]) => {
    if (value === undefined) return;

    if (key === "count") {
      const count = Number(value);
      if (count < 1 || count > 100) {
        throw new Error("count must be between 1 and 100");
      }
    }

    url.searchParams.append(key, value.toString());
  });

  // Fetch data from the API
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(503, errorBody);
  }

  // Parse and validate response data
  const data = await response.json();
  const validJobs: Job[] = [];
  // Validate each job entry
  for (const job of data.jobs) {
    const parsed = JobSchema.safeParse(job);
    if (parsed.success) {
      validJobs.push(parsed.data);
    }
  }
  return validJobs;
}
