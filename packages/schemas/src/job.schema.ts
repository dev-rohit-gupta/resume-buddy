import { z } from 'zod';

export const JobSchema = z.object({
    id: z.number(),
    url: z.string(),
    jobTitle: z.string(),
    companyName: z.string(),
    companyLogo: z.string().optional(),
    jobIndustry: z.array(z.string()),
    jobType: z.array(z.string()),
    jobGeo: z.string(),
    jobLevel: z.string(),
    jobExcerpt: z.string(),
    jobDescription: z.string(),
    pubDate: z.string(),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    salaryCurrency: z.string().optional(),
    salaryPeriod: z.string().optional(),
});

export type Job = z.infer<typeof JobSchema>;
