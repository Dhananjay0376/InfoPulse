import { Router } from "express";

export const campaignRouter = Router();

campaignRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "List campaigns endpoint not implemented yet",
  });
});

campaignRouter.post("/", (_req, res) => {
  res.status(501).json({
    message: "Create campaign endpoint not implemented yet",
  });
});

campaignRouter.post("/:campaignId/launch", (_req, res) => {
  res.status(501).json({
    message: "Launch campaign endpoint not implemented yet",
  });
});
