import { Queue } from "bullmq";

import { getRedisConnectionOptions } from "./redis.js";
import {
  EMAIL_DELIVERY_QUEUE,
  type EmailDeliveryJobData,
} from "../types/queue.js";

export const emailDeliveryQueue = new Queue<EmailDeliveryJobData, void, "deliver-email">(
  EMAIL_DELIVERY_QUEUE,
  {
    connection: getRedisConnectionOptions(),
  }
);
