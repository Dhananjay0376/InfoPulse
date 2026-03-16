import { Worker } from "bullmq";
import IORedis from "ioredis";

import { env } from "./config/env.js";
import { processCampaignLaunch } from "./jobs/process-campaign-launch.js";
import { processEmailDelivery } from "./jobs/process-email-delivery.js";
import {
  CAMPAIGN_LAUNCH_QUEUE,
  EMAIL_DELIVERY_QUEUE,
  type CampaignLaunchJobData,
  type EmailDeliveryJobData,
} from "./types/queue.js";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const campaignLaunchWorker = new Worker<CampaignLaunchJobData>(
  CAMPAIGN_LAUNCH_QUEUE,
  async (job) => {
    const queuedCount = await processCampaignLaunch(job.data.campaignId);
    console.log(`Campaign ${job.data.campaignId} queued ${queuedCount} email jobs`);
  },
  { connection }
);

const emailDeliveryWorker = new Worker<EmailDeliveryJobData>(
  EMAIL_DELIVERY_QUEUE,
  async (job) => {
    await processEmailDelivery(job.data.campaignRecipientId);
    console.log(`Delivered queued email job ${job.id}`);
  },
  { connection }
);

campaignLaunchWorker.on("failed", (job, error) => {
  console.error(`Campaign launch job ${job?.id ?? "unknown"} failed`, error);
});

emailDeliveryWorker.on("failed", (job, error) => {
  console.error(`Email delivery job ${job?.id ?? "unknown"} failed`, error);
});

console.log(`${env.APP_NAME} started`);
