import { getOpportunitiesController } from "../controllers/opportunity.controller.js";
import { Router } from "express";

const router = Router();
// GET /api/opportunities
router.route("/").get(getOpportunitiesController);

export default router;
