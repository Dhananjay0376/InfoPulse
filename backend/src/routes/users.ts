import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import { createUserSchema } from "../schemas/users.js";
import { createUser, listUsers } from "../services/users.js";

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
