import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import { createCustomer, listCustomers } from "../repositories/customers.js";
import { customerInputSchema } from "../schemas/customers.js";

export const customerRouter = Router();

customerRouter.get(
  "/",
  requireAuth,
  requireRole(["admin", "sender", "viewer"]),
  asyncHandler(async (_req, res) => {
    const customers = await listCustomers();
    res.json({ customers });
  })
);

customerRouter.post(
  "/",
  requireAuth,
  requireRole(["admin", "sender"]),
  validateBody(customerInputSchema),
  asyncHandler(async (req, res) => {
    const customer = await createCustomer({
      ...req.body,
      createdBy: req.auth!.userId,
    });

    res.status(201).json({ customer });
  })
);

customerRouter.post("/import", requireAuth, requireRole(["admin", "sender"]), (_req, res) => {
  res.status(501).json({
    message: "Import customers endpoint not implemented yet",
  });
});
