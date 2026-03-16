import { db } from "../db/pool.js";
import type { MessageDeliveryRecord } from "../types/delivery.js";

function mapDelivery(row: Record<string, unknown>): MessageDeliveryRecord {
  return {
    id: String(row.id),
    campaignId: String(row.campaign_id),
    campaignRecipientId: String(row.campaign_recipient_id),
    customerId: String(row.customer_id),
    provider: String(row.provider),
    providerMessageId: row.provider_message_id ? String(row.provider_message_id) : null,
    status: row.status as MessageDeliveryRecord["status"],
    errorCode: row.error_code ? String(row.error_code) : null,
    errorMessage: row.error_message ? String(row.error_message) : null,
    sentAt: row.sent_at ? String(row.sent_at) : null,
    deliveredAt: row.delivered_at ? String(row.delivered_at) : null,
    failedAt: row.failed_at ? String(row.failed_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listDeliveries(limit = 100) {
  const result = await db.query(
    `SELECT id, campaign_id, campaign_recipient_id, customer_id, provider, provider_message_id,
            status, error_code, error_message, sent_at, delivered_at, failed_at, created_at, updated_at
     FROM message_deliveries
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map(mapDelivery);
}

export async function listCampaignDeliveries(campaignId: string, limit = 100) {
  const result = await db.query(
    `SELECT id, campaign_id, campaign_recipient_id, customer_id, provider, provider_message_id,
            status, error_code, error_message, sent_at, delivered_at, failed_at, created_at, updated_at
     FROM message_deliveries
     WHERE campaign_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [campaignId, limit]
  );

  return result.rows.map(mapDelivery);
}

export async function getCampaignDeliverySummary(campaignId: string) {
  const result = await db.query(
    `SELECT status, COUNT(*)::int AS total
     FROM message_deliveries
     WHERE campaign_id = $1
     GROUP BY status`,
    [campaignId]
  );

  return result.rows.reduce<Record<string, number>>((acc, row) => {
    acc[String(row.status)] = Number(row.total);
    return acc;
  }, {});
}
