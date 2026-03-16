import { Worker } from "bullmq";

import { env } from "./config/env.js";
import { processCampaignLaunch } from "./jobs/process-campaign-launch.js";
import { processEmailDelivery } from "./jobs/process-email-delivery.js";
import { getRedisConnectionOptions } from "./queue/redis.js";
import {
  CAMPAIGN_LAUNCH_QUEUE,
  EMAIL_DELIVERY_QUEUE,
  type CampaignLaunchJobData,
  type EmailDeliveryJobData,
} from "./types/queue.js";

const campaignLaunchWorker = new Worker<CampaignLaunchJobData, void, "launch-campaign">(
  CAMPAIGN_LAUNCH_QUEUE,
  async (job) => {
    const queuedCount = await processCampaignLaunch(job.data.campaignId);
    console.log(`Campaign ${job.data.campaignId} queued ${queuedCount} email jobs`);
  },
  { connection: getRedisConnectionOptions() }
);

const emailDeliveryWorker = new Worker<EmailDeliveryJobData, void, "deliver-email">(
  EMAIL_DELIVERY_QUEUE,
  async (job) => {
    await processEmailDelivery(job.data.campaignRecipientId);
    console.log(`Delivered queued email job ${job.id}`);
  },
  { connection: getRedisConnectionOptions() }
);

campaignLaunchWorker.on("failed", (job, error) => {
  console.error(`Campaign launch job ${job?.id ?? "unknown"} failed`, error);
});

emailDeliveryWorker.on("failed", (job, error) => {
  console.error(`Email delivery job ${job?.id ?? "unknown"} failed`, error);
});

console.log(`${env.APP_NAME} started`);
