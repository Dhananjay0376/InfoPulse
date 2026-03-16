import { Queue } from "bullmq";
import IORedis from "ioredis";

import { env } from "../config/env.js";
import {
  CAMPAIGN_LAUNCH_QUEUE,
  type CampaignLaunchJobData,
} from "./contracts.js";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const campaignLaunchQueue = new Queue<CampaignLaunchJobData>(CAMPAIGN_LAUNCH_QUEUE, {
  connection,
});

export async function enqueueCampaignLaunch(job: CampaignLaunchJobData) {
  await campaignLaunchQueue.add("launch-campaign", job, {
    jobId: `campaign-launch:${job.campaignId}`,
    removeOnComplete: 100,
    removeOnFail: 500,
  });
}
