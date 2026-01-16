import { getOpportunityService } from "../services/opportunity.service.js";
import { Request,Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiResponse ,ApiError} from "@resume-buddy/utils";
import { Job } from "@resume-buddy/schemas";

export const getOpportunitiesController = asyncHandler(async (req: Request, res: Response) => {
    const filterOptions = {
        count: req.query.count ? Number(req.query.count) : undefined,
        geo: req.query.geo as string | undefined,
        industry: req.query.industry as string | undefined,
        tag: req.query.tag as string | undefined,
    };

    const jobs =  await getOpportunityService(filterOptions);
    const statusCode = 200;
   return res
    .status(statusCode)
    .json(new ApiResponse<Job[]>(jobs,"Opportunities fetched successfully", statusCode));
})