import { Router } from "express";

export const templateRouter = Router();

templateRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "List templates endpoint not implemented yet",
  });
});

templateRouter.post("/", (_req, res) => {
  res.status(501).json({
    message: "Create template endpoint not implemented yet",
  });
});
