import { db } from "../db/pool.js";
import type { CustomerRecord } from "../types/customer.js";

interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  notes?: string;
  emailOptIn: boolean;
  createdBy: string;
}

function mapCustomer(row: Record<string, unknown>): CustomerRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    dob: row.dob ? String(row.dob) : null,
    gender: row.gender ? String(row.gender) : null,
    status: row.status as CustomerRecord["status"],
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    emailOptIn: Boolean(row.email_opt_in),
  };
}

export async function listCustomers() {
  const result = await db.query(
    `SELECT c.id, c.name, c.email, c.phone, c.dob, c.gender, c.status, c.notes, c.created_at, c.updated_at,
            COALESCE(cc.opt_in, FALSE) AS email_opt_in
     FROM customers c
     LEFT JOIN customer_consents cc
       ON cc.customer_id = c.id AND cc.channel = 'email'
     ORDER BY c.created_at DESC`
  );

  return result.rows.map(mapCustomer);
}

export async function createCustomer(input: CreateCustomerInput) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const customerResult = await client.query(
      `INSERT INTO customers (name, email, phone, dob, gender, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, phone, dob, gender, status, notes, created_at, updated_at`,
      [
        input.name,
        input.email.toLowerCase(),
        input.phone ?? null,
        input.dob ?? null,
        input.gender ?? null,
        input.notes ?? null,
        input.createdBy,
      ]
    );

    const customer = customerResult.rows[0];

    await client.query(
      `INSERT INTO customer_consents (customer_id, channel, opt_in, opt_in_at, source)
       VALUES ($1, 'email', $2, CASE WHEN $2 THEN NOW() ELSE NULL END, 'manual-entry')`,
      [customer.id, input.emailOptIn]
    );

    await client.query("COMMIT");

    return mapCustomer({
      ...customer,
      email_opt_in: input.emailOptIn,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
