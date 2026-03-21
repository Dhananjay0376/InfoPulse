import { Router } from "express";

import { authRouter } from "./auth.js";
import { campaignRouter } from "./campaigns.js";
import { customerRouter } from "./customers.js";
import { deliveryRouter } from "./deliveries.js";
import { templateRouter } from "./templates.js";
import { userRouter } from "./users.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    name: "InfoPulse API v1",
    resources: ["auth", "customers", "templates", "campaigns", "deliveries", "users"],
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/templates", templateRouter);
apiRouter.use("/campaigns", campaignRouter);
apiRouter.use("/deliveries", deliveryRouter);
apiRouter.use("/users", userRouter);
