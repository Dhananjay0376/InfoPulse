import { Queue } from "bullmq";
import IORedis from "ioredis";

import { env } from "../config/env.js";
import {
  EMAIL_DELIVERY_QUEUE,
  type EmailDeliveryJobData,
} from "../types/queue.js";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const emailDeliveryQueue = new Queue<EmailDeliveryJobData>(EMAIL_DELIVERY_QUEUE, {
  connection,
});
