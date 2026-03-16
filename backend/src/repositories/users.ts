import { db } from "../db/pool.js";
import type { UserRecord } from "../types/user.js";

function mapUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    fullName: String(row.full_name),
    role: row.role as UserRecord["role"],
    isActive: Boolean(row.is_active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function findUserByEmail(email: string) {
  const result = await db.query(
    `SELECT id, email, password_hash, full_name, role, is_active, created_at, updated_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email.toLowerCase()]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function findUserById(id: string) {
  const result = await db.query(
    `SELECT id, email, password_hash, full_name, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}
