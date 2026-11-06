// Legt den ersten Admin-Account an.
// Aufruf: npx tsx prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "bertolo@b2solutions.de";
  const password = process.env.SEED_ADMIN_PASSWORD || "bitte-aendern-123";
  const name = process.env.SEED_ADMIN_NAME || "Gian Luca";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} existiert bereits – nichts zu tun.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed, role: "ADMIN" },
  });

  console.log(`Admin angelegt: ${email}`);
  console.log(`Vorläufiges Passwort: ${password} (bitte nach dem ersten Login ändern)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
