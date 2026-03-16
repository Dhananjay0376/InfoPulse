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

export async function snapshotCampaignRecipients(campaignId: string) {
  const result = await db.query(
    `WITH template_data AS (
       SELECT id, subject, body_html, body_text
       FROM email_templates
       WHERE id = (SELECT template_id FROM campaigns WHERE id = $1)
     ), inserted AS (
       INSERT INTO campaign_recipients (
         campaign_id,
         customer_id,
         resolved_email,
         rendered_subject,
         rendered_body_html,
         rendered_body_text,
         status
       )
       SELECT
         $1,
         c.id,
         c.email,
         t.subject,
         t.body_html,
         t.body_text,
         'queued'
       FROM customers c
       CROSS JOIN template_data t
       INNER JOIN customer_consents cc
         ON cc.customer_id = c.id
        AND cc.channel = 'email'
        AND cc.opt_in = TRUE
       WHERE c.status = 'active'
       ON CONFLICT (campaign_id, customer_id) DO NOTHING
       RETURNING id
     )
     SELECT COUNT(*)::int AS recipient_count FROM inserted`,
    [campaignId]
  );

  const recipientCount = Number(result.rows[0]?.recipient_count ?? 0);

  await db.query(
    `UPDATE campaigns
     SET recipient_count = $2, updated_at = NOW()
     WHERE id = $1`,
    [campaignId, recipientCount]
  );

  return recipientCount;
}

export async function listQueuedCampaignRecipients(campaignId: string) {
  const result = await db.query(
    `SELECT id
     FROM campaign_recipients
     WHERE campaign_id = $1 AND status = 'queued'
     ORDER BY queued_at ASC`,
    [campaignId]
  );

  return result.rows.map((row) => String(row.id));
}
