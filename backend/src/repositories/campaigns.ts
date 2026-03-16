import { db } from "../db/pool.js";
import type { CampaignRecord } from "../types/campaign.js";

interface CreateCampaignInput {
  name: string;
  templateId: string;
  scheduledAt?: string;
  createdBy: string;
}

function mapCampaign(row: Record<string, unknown>): CampaignRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    channel: "email",
    templateId: String(row.template_id),
    status: row.status as CampaignRecord["status"],
    scheduledAt: row.scheduled_at ? String(row.scheduled_at) : null,
    launchedAt: row.launched_at ? String(row.launched_at) : null,
    completedAt: row.completed_at ? String(row.completed_at) : null,
    recipientCount: Number(row.recipient_count),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listCampaigns() {
  const result = await db.query(
    `SELECT id, name, template_id, status, scheduled_at, launched_at, completed_at, recipient_count, created_at, updated_at
     FROM campaigns
     ORDER BY created_at DESC`
  );

  return result.rows.map(mapCampaign);
}

export async function createCampaign(input: CreateCampaignInput) {
  const result = await db.query(
    `INSERT INTO campaigns (name, template_id, status, scheduled_at, created_by)
     VALUES ($1, $2, CASE WHEN $3::timestamptz IS NULL THEN 'draft' ELSE 'scheduled' END, $3, $4)
     RETURNING id, name, template_id, status, scheduled_at, launched_at, completed_at, recipient_count, created_at, updated_at`,
    [input.name, input.templateId, input.scheduledAt ?? null, input.createdBy]
  );

  return mapCampaign(result.rows[0]);
}

export async function launchCampaign(campaignId: string) {
  const result = await db.query(
    `UPDATE campaigns
     SET status = 'processing', launched_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND status IN ('draft', 'scheduled')
     RETURNING id, name, template_id, status, scheduled_at, launched_at, completed_at, recipient_count, created_at, updated_at`,
    [campaignId]
  );

  return result.rows[0] ? mapCampaign(result.rows[0]) : null;
}
