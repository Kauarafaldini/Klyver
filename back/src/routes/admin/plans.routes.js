import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";

const router = Router();

// Middleware que garante que é ADMIN
function requireAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

/**
 * Listar todos os planos
 */
router.get("/", authenticate, requireAdmin, async (req, res) => {
  const plans = await prisma.plan.findMany();
  return res.json(plans);
});

/**
 * Criar novo plano
 */
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, maxEmployees, maxProducts } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
        maxEmployees,
        maxProducts,
      },
    });

    return res.status(201).json({ message: "Plano criado com sucesso", plan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * Atualizar plano
 */
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, maxEmployees, maxProducts, active } = req.body;

    const plan = await prisma.plan.update({
      where: { id: Number(id) },
      data: { name, description, price, maxEmployees, maxProducts, active },
    });

    return res.json({ message: "Plano atualizado com sucesso", plan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * Ativar/Desativar plano
 */
router.patch("/:id/toggle", authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findUnique({ where: { id: Number(id) } });
    if (!plan) return res.status(404).json({ error: "Plano não encontrado" });

    const updatedPlan = await prisma.plan.update({
      where: { id: Number(id) },
      data: { active: !plan.active },
    });

    return res.json({ message: `Plano ${updatedPlan.active ? "ativado" : "desativado"} com sucesso`, plan: updatedPlan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
