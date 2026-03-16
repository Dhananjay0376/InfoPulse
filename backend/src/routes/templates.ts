import { Router } from "express";

import { validateBody } from "../middleware.validate.js";
import { templateInputSchema } from "../schemas/templates.js";

export const templateRouter = Router();

templateRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "List templates endpoint not implemented yet",
  });
});

templateRouter.post("/", validateBody(templateInputSchema), (req, res) => {
  res.status(501).json({
    message: "Create template endpoint not implemented yet",
    received: req.body,
  });
});
