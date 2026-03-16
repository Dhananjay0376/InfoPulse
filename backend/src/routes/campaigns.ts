import { Router } from "express";

import { validateBody } from "../middleware.validate.js";
import { campaignInputSchema } from "../schemas/campaigns.js";

export const campaignRouter = Router();

campaignRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "List campaigns endpoint not implemented yet",
  });
});

campaignRouter.post("/", validateBody(campaignInputSchema), (req, res) => {
  res.status(501).json({
    message: "Create campaign endpoint not implemented yet",
    received: req.body,
  });
});

campaignRouter.post("/:campaignId/launch", (_req, res) => {
  res.status(501).json({
    message: "Launch campaign endpoint not implemented yet",
  });
});
