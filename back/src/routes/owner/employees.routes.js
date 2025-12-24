import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";
import bcrypt from "bcryptjs";

const router = Router();

// Middleware que verifica se é OWNER
function requireOwner(req, res, next) {
  if (req.user.role !== "OWNER") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

/**
 * Criar funcionário
 */
router.post("/", authenticate, requireOwner, async (req, res) => {
  try {
    const { name, email, password, cpf } = req.body;

    if (!name || !email || !password || !cpf) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Buscar empresa do owner
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: true },
    });

    if (!owner.establishments.length) {
      return res.status(400).json({ error: "Owner não tem empresa" });
    }

    const establishment = owner.establishments[0]; // assumindo 1 empresa por owner

    // Verificar limite do plano
    const employeeCount = await prisma.user.count({
      where: { establishments: { some: { id: establishment.id } }, role: "USER" },
    });

    if (owner.establishments[0].planId) {
      const plan = await prisma.plan.findUnique({ where: { id: establishment.planId } });
      if (plan.maxEmployees && employeeCount >= plan.maxEmployees) {
        return res.status(400).json({ error: "Limite de funcionários do plano atingido" });
      }
    }

    // Verificar se email ou cpf já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email já cadastrado" });

    // Criar hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar funcionário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "USER",
        establishments: {
          connect: { id: establishment.id },
        },
      },
    });

    return res.status(201).json({ message: "Funcionário criado", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
