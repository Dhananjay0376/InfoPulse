import { Router } from "express";

import { authRouter } from "./auth.js";
import { campaignRouter } from "./campaigns.js";
import { customerRouter } from "./customers.js";
import { templateRouter } from "./templates.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    name: "InfoPulse API v1",
    resources: ["auth", "customers", "templates", "campaigns"],
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/templates", templateRouter);
apiRouter.use("/campaigns", campaignRouter);
