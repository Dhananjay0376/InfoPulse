import { Router } from "express";

export const authRouter = Router();

authRouter.post("/login", (_req, res) => {
  res.status(501).json({
    message: "Login endpoint not implemented yet",
  });
});

authRouter.get("/me", (_req, res) => {
  res.status(501).json({
    message: "Current user endpoint not implemented yet",
  });
});
