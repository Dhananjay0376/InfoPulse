import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import { createUserSchema, resetPasswordSchema, updateUserSchema } from "../schemas/users.js";
import { createUser, listUsers, resetUserPassword, updateUser } from "../services/users.js";

export const userRouter = Router();

userRouter.get(
  "/",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(async (_req, res) => {
    const users = await listUsers();
    res.json({ users });
  })
);

userRouter.post(
  "/",
  requireAuth,
  requireRole(["admin"]),
  validateBody(createUserSchema),
  asyncHandler(async (req, res) => {
    const user = await createUser(req.body);
    res.status(201).json({ user });
  })
);

userRouter.patch(
  "/:userId",
  requireAuth,
  requireRole(["admin"]),
  validateBody(updateUserSchema),
  asyncHandler(async (req, res) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const user = await updateUser({ userId, ...req.body });
    res.json({ user });
  })
);

userRouter.post(
  "/:userId/reset-password",
  requireAuth,
  requireRole(["admin"]),
  validateBody(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const user = await resetUserPassword({ userId, password: req.body.password });
    res.json({ user });
  })
);
