import { Router } from "express";

import { validateBody } from "../middleware.validate.js";
import { customerInputSchema } from "../schemas/customers.js";

export const customerRouter = Router();

customerRouter.get("/", (_req, res) => {
  res.status(501).json({
    message: "List customers endpoint not implemented yet",
  });
});

customerRouter.post("/", validateBody(customerInputSchema), (req, res) => {
  res.status(501).json({
    message: "Create customer endpoint not implemented yet",
    received: req.body,
  });
});

customerRouter.post("/import", (_req, res) => {
  res.status(501).json({
    message: "Import customers endpoint not implemented yet",
  });
});
