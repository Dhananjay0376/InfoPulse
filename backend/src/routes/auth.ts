import { Router } from "express";

import { validateBody } from "../middleware.validate.js";
import { loginSchema } from "../schemas/auth.js";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), (req, res) => {
  res.status(501).json({
    message: "Login endpoint not implemented yet",
    received: req.body,
  });
});

authRouter.get("/me", (_req, res) => {
  res.status(501).json({
    message: "Current user endpoint not implemented yet",
  });
});
