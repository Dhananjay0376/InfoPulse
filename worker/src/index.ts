import { Worker } from "bullmq";
import IORedis from "ioredis";

import { env } from "./config/env.js";
import { processCampaignLaunch } from "./jobs/process-campaign-launch.js";
import { CAMPAIGN_LAUNCH_QUEUE, type CampaignLaunchJobData } from "./types/queue.js";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker<CampaignLaunchJobData>(
  CAMPAIGN_LAUNCH_QUEUE,
  async (job) => {
    const queuedCount = await processCampaignLaunch(job.data.campaignId);
    console.log(`Campaign ${job.data.campaignId} queued ${queuedCount} email jobs`);
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`Completed worker job ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Worker job ${job?.id ?? "unknown"} failed`, error);
});

console.log(`${env.APP_NAME} started`);
