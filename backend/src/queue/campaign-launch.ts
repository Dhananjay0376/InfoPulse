import { Queue } from "bullmq";

import { getRedisConnectionOptions } from "./redis.js";
import {
  CAMPAIGN_LAUNCH_QUEUE,
  type CampaignLaunchJobData,
} from "./contracts.js";

const campaignLaunchQueue = new Queue<CampaignLaunchJobData, void, "launch-campaign">(
  CAMPAIGN_LAUNCH_QUEUE,
  {
    connection: getRedisConnectionOptions(),
  }
);

export async function enqueueCampaignLaunch(job: CampaignLaunchJobData) {
  await campaignLaunchQueue.add("launch-campaign", job, {
    jobId: `campaign-launch:${job.campaignId}`,
    removeOnComplete: 100,
    removeOnFail: 500,
  });
}
