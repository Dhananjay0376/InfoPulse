import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { getCampaignDeliverySummary, listCampaignDeliveries, listDeliveries } from "../repositories/deliveries.js";

export const deliveryRouter = Router();

deliveryRouter.get(
  "/",
  requireAuth,
  requireRole(["admin", "sender", "viewer"]),
  asyncHandler(async (_req, res) => {
    const deliveries = await listDeliveries();
    res.json({ deliveries });
  })
);

deliveryRouter.get(
  "/campaigns/:campaignId",
  requireAuth,
  requireRole(["admin", "sender", "viewer"]),
  asyncHandler(async (req, res) => {
    const campaignId = Array.isArray(req.params.campaignId)
      ? req.params.campaignId[0]
      : req.params.campaignId;

    const [summary, deliveries] = await Promise.all([
      getCampaignDeliverySummary(campaignId),
      listCampaignDeliveries(campaignId),
    ]);

    res.json({ summary, deliveries });
  })
);
