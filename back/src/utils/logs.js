import prisma from "../lib/prisma.js";

export async function createLog(userId, action) {
  try {
    await prisma.logs.create({
      data: {
        userId,
        action,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error.message);
  }
}
