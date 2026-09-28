import prisma from "../lib/prisma.js";

export async function createLog(userId, action) {
  try {
    await prisma.log.create({
      data: {
        userId,
        action,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error.message);
  }
}
