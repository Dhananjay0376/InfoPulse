import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import { createTemplate, listTemplates } from "../repositories/templates.js";
import { templateInputSchema } from "../schemas/templates.js";

export const templateRouter = Router();

templateRouter.get(
  "/",
  requireAuth,
  requireRole(["admin", "sender", "viewer"]),
  asyncHandler(async (_req, res) => {
    const templates = await listTemplates();
    res.json({ templates });
  })
);

templateRouter.post(
  "/",
  requireAuth,
  requireRole(["admin", "sender"]),
  validateBody(templateInputSchema),
  asyncHandler(async (req, res) => {
    const template = await createTemplate({
      ...req.body,
      createdBy: req.auth!.userId,
    });

    res.status(201).json({ template });
  })
);
