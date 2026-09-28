import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@klyver.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456";
  const adminName = "Administrador Klyver";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      password: passwordHash,
      name: adminName,
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Usuário ADMIN criado/atualizado com sucesso!");
  console.log("-----------------------------------------");
  console.log(`E-mail: ${admin.email}`);
  console.log(`Senha:  ${adminPassword}`);
  console.log(`Role:   ${admin.role}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("Erro ao criar admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
