import { db } from "../db/pool.js";
import type { UserRecord, UserRole } from "../types/user.js";

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

export async function listUserRecords() {
  const result = await db.query(
    `SELECT id, email, password_hash, full_name, role, is_active, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows.map(mapUser);
}

interface CreateUserRecordInput {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
}

export async function createUserRecord(input: CreateUserRecordInput) {
  const result = await db.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, password_hash, full_name, role, is_active, created_at, updated_at`,
    [input.email.toLowerCase(), input.passwordHash, input.fullName, input.role]
  );

  return mapUser(result.rows[0]);
}

interface UpdateUserRecordInput {
  userId: string;
  role: UserRole;
  isActive: boolean;
}

export async function updateUserRecord(input: UpdateUserRecordInput) {
  const result = await db.query(
    `UPDATE users
     SET role = $2,
         is_active = $3,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, password_hash, full_name, role, is_active, created_at, updated_at`,
    [input.userId, input.role, input.isActive]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const result = await db.query(
    `UPDATE users
     SET password_hash = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, password_hash, full_name, role, is_active, created_at, updated_at`,
    [userId, passwordHash]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}
