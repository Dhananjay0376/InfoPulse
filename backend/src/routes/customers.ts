import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import {
  createCustomer,
  deleteCustomer,
  deleteCustomers,
  listCustomers,
  updateCustomer,
} from "../repositories/customers.js";
import { bulkDeleteCustomersSchema, customerInputSchema } from "../schemas/customers.js";

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

customerRouter.put(
  "/:customerId",
  requireAuth,
  requireRole(["admin", "sender"]),
  validateBody(customerInputSchema),
  asyncHandler(async (req, res) => {
    const customerId = Array.isArray(req.params.customerId)
      ? req.params.customerId[0]
      : req.params.customerId;

    const customer = await updateCustomer({
      id: customerId,
      ...req.body,
    });

    if (!customer) {
      throw new HttpError(404, "Customer not found");
    }

    res.json({ customer });
  })
);

customerRouter.delete(
  "/:customerId",
  requireAuth,
  requireRole(["admin", "sender"]),
  asyncHandler(async (req, res) => {
    const customerId = Array.isArray(req.params.customerId)
      ? req.params.customerId[0]
      : req.params.customerId;

    const deleted = await deleteCustomer(customerId);

    if (!deleted) {
      throw new HttpError(404, "Customer not found");
    }

    res.status(204).send();
  })
);

customerRouter.post(
  "/bulk-delete",
  requireAuth,
  requireRole(["admin", "sender"]),
  validateBody(bulkDeleteCustomersSchema),
  asyncHandler(async (req, res) => {
    const deletedCount = await deleteCustomers(req.body.ids);
    res.json({ deletedCount });
  })
);

customerRouter.post("/import", requireAuth, requireRole(["admin", "sender"]), (_req, res) => {
  res.status(501).json({
    message: "Import customers endpoint not implemented yet",
  });
});
