import { db } from "../db/pool.js";
import type { EmailTemplateRecord } from "../types/template.js";

interface CreateTemplateInput {
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  variables: string[];
  createdBy: string;
}

function mapTemplate(row: Record<string, unknown>): EmailTemplateRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    subject: String(row.subject),
    bodyHtml: String(row.body_html),
    bodyText: row.body_text ? String(row.body_text) : null,
    variables: Array.isArray(row.variables) ? row.variables.map(String) : [],
    isActive: Boolean(row.is_active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listTemplates() {
  const result = await db.query(
    `SELECT id, name, subject, body_html, body_text, variables, is_active, created_at, updated_at
     FROM email_templates
     ORDER BY created_at DESC`
  );

  return result.rows.map(mapTemplate);
}

export async function createTemplate(input: CreateTemplateInput) {
  const result = await db.query(
    `INSERT INTO email_templates (name, subject, body_html, body_text, variables, created_by)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)
     RETURNING id, name, subject, body_html, body_text, variables, is_active, created_at, updated_at`,
    [
      input.name,
      input.subject,
      input.bodyHtml,
      input.bodyText ?? null,
      JSON.stringify(input.variables),
      input.createdBy,
    ]
  );

  return mapTemplate(result.rows[0]);
}
