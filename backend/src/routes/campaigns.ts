import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import { createCampaign, launchCampaign, listCampaigns } from "../repositories/campaigns.js";
import { campaignInputSchema } from "../schemas/campaigns.js";

export const campaignRouter = Router();

campaignRouter.get(
  "/",
  requireAuth,
  requireRole(["admin", "sender", "viewer"]),
  asyncHandler(async (_req, res) => {
    const campaigns = await listCampaigns();
    res.json({ campaigns });
  })
);

campaignRouter.post(
  "/",
  requireAuth,
  requireRole(["admin", "sender"]),
  validateBody(campaignInputSchema),
  asyncHandler(async (req, res) => {
    const campaign = await createCampaign({
      ...req.body,
      createdBy: req.auth!.userId,
    });

    res.status(201).json({ campaign });
  })
);

campaignRouter.post(
  "/:campaignId/launch",
  requireAuth,
  requireRole(["admin", "sender"]),
  asyncHandler(async (req, res) => {
    const campaign = await launchCampaign(req.params.campaignId);

    if (!campaign) {
      throw new HttpError(404, "Campaign not found or not launchable");
    }

    res.json({ campaign });
  })
);
