import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { apiRouter } from "./routes/api.js";
import { healthRouter } from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "InfoPulse backend is running",
  });
});

app.use("/health", healthRouter);
app.use("/api/v1", apiRouter);

app.listen(env.PORT, () => {
  console.log(`${env.APP_NAME} listening on port ${env.PORT}`);
});
