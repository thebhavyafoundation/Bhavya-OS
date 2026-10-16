/**
 * AI Institute — Create Admin User Script
 *
 * Usage: npx tsx src/scripts/create-admin-user.ts
 *
 * Requires environment variables:
 * - TURSO_DATABASE_URL (e.g., libsql://your-db.turso.io)
 * - TURSO_AUTH_TOKEN (your auth token)
 *
 * Creates an admin user "Manohar Lal" with role "admin" in the production Turso database.
 */

import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function main() {
  const dbUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(
      "Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required",
    );
    console.error(
      "Get these from Cloudflare Worker secrets or your local .env.local",
    );
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL || "manohar.lal@bhavya.foundation";
  const name = process.env.ADMIN_NAME || "Manohar Lal";
  const password = process.env.ADMIN_PASSWORD || "ManoharLal@2026!SecureAdmin";
  const role = "admin";

  console.log(`Creating admin user: ${name} (${email}) with role: ${role}`);

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  try {
    // Check if user already exists
    const existing = await client.execute({
      sql: "SELECT id, email, name, role FROM users WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      console.log(
        `User already exists: ${existing.rows[0].email} (role: ${existing.rows[0].role})`,
      );

      // Update role to admin if not already
      if (existing.rows[0].role !== "admin") {
        await client.execute({
          sql: "UPDATE users SET role = ?, updated_at = ? WHERE email = ?",
          args: [role, new Date().toISOString(), email],
        });
        console.log(`Updated role to: ${role}`);
      }
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    const id = generateId();

    // Insert admin user
    await client.execute({
      sql: `INSERT INTO users (id, email, name, role, provider, interests, onboarding_complete, password_hash, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'email', '[]', 1, ?, ?, ?)`,
      args: [id, email, name, role, passwordHash, now, now],
    });

    console.log(`✓ Created admin user: ${name} (${email})`);
    console.log(`  ID: ${id}`);
    console.log(`  Role: ${role}`);
    console.log(`\nLogin credentials:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`\n⚠️  IMPORTANT: Change the password after first login!`);
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error("Script failed:", e);
  process.exit(1);
});
