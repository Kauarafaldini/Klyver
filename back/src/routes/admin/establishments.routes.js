import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";
import bcrypt from "bcryptjs";

const router = Router();

// Middleware que garante que é ADMIN
function requireAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

/**
 * Listar todas as empresas
 */
router.get("/", authenticate, requireAdmin, async (req, res) => {
  const establishments = await prisma.establishment.findMany({
    include: {
      owner: true,
      plan: true,
    },
  });
  return res.json(establishments);
});

/**
 * Cadastrar nova empresa + dono
 */
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { ownerName, ownerEmail, ownerPassword, companyName, fantasyName, cnpj, planId } = req.body;

    if (!ownerName || !ownerEmail || !ownerPassword || !companyName || !cnpj || !planId) {
      return res.status(400).json({ error: "Todos os campos obrigatórios" });
    }

    // Verifica se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (existingUser) return res.status(400).json({ error: "Email do dono já cadastrado" });

    // Cria hash da senha do dono
    const passwordHash = await bcrypt.hash(ownerPassword, 10);

    // Cria o usuário OWNER
    const owner = await prisma.user.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        password: passwordHash,
        role: "OWNER",
      },
    });

    // Cria a empresa e vincula ao dono e plano
    const establishment = await prisma.establishment.create({
      data: {
        companyName,
        fantasyName,
        cnpj,
        ownerId: owner.id,
        planId,
      },
      include: { owner: true, plan: true },
    });

    return res.status(201).json({ message: "Empresa criada com sucesso", establishment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
