import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware.validate.js";
import { loginSchema } from "../schemas/auth.js";
import { getCurrentUser, loginUser } from "../services/auth.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const session = await loginUser(req.body.email, req.body.password);
    res.json(session);
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await getCurrentUser(req.auth!.userId);
    res.json({ user });
  })
);
