import { Router } from "express";

export const customerRouter = Router();

customerRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "List customers endpoint not implemented yet",
  });
});

customerRouter.post("/", (_req, res) => {
  res.status(501).json({
    message: "Create customer endpoint not implemented yet",
  });
});

customerRouter.post("/import", (_req, res) => {
  res.status(501).json({
    message: "Import customers endpoint not implemented yet",
  });
});
