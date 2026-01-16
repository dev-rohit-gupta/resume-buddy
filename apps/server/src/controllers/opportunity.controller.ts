import { getOpportunityService } from "../services/opportunity.service.js";
import { Request,Response } from "express";
import { asyncHandler } from "@resume-buddy/utils";
import { ApiResponse ,ApiError} from "@resume-buddy/utils";
import { Job } from "@resume-buddy/schemas";

export const getOpportunitiesController = asyncHandler(async (req: Request, res: Response) => {
    const filterOptions = {
        search: req.query.search as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        company_name: req.query.company_name as string | undefined,
        category: req.query.category as string | undefined,
    };

    const jobs =  await getOpportunityService(filterOptions);
    const statusCode = 200;
   return res
    .status(statusCode)
    .json(new ApiResponse<Job[]>(jobs,"Opportunities fetched successfully", statusCode));
})