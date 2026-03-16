import { db } from "../db/pool.js";
import { hashPassword } from "../services/password.js";

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@infopulse.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const fullName = process.env.SEED_ADMIN_NAME ?? "InfoPulse Admin";
  const passwordHash = await hashPassword(password);

  const result = await db.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name, role = 'admin', updated_at = NOW()
     RETURNING id, email, full_name, role`,
    [email.toLowerCase(), passwordHash, fullName]
  );

  console.log(`Seeded admin user ${result.rows[0].email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
