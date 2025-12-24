import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";

const router = Router();

// Middleware que verifica se é OWNER
function requireOwner(req, res, next) {
  if (req.user.role !== "OWNER") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

/**
 * Criar produto
 */
router.post("/", authenticate, requireOwner, async (req, res) => {
  try {
    const { name, category, currentStock, unit, minStock, unitPrice, type, description } = req.body;

    if (!name || !unitPrice) {
      return res.status(400).json({ error: "Nome e preço unitário são obrigatórios" });
    }

    // Buscar empresa do owner
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: true },
    });

    if (!owner.establishments.length) return res.status(400).json({ error: "Owner não tem empresa" });

    const establishment = owner.establishments[0];

    // Verificar limite do plano
    const productCount = await prisma.product.count({
      where: { establishmentId: establishment.id },
    });

    const plan = await prisma.plan.findUnique({ where: { id: establishment.planId } });
    if (plan.maxProducts && productCount >= plan.maxProducts) {
      return res.status(400).json({ error: "Limite de produtos do plano atingido" });
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        establishmentId: establishment.id,
        name,
        category,
        currentStock: currentStock || 0,
        unit,
        minStock: minStock || 0,
        unitPrice,
        type,
        description,
      },
    });

    return res.status(201).json({ message: "Produto criado", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * Listar produtos da empresa
 */
router.get("/", authenticate, requireOwner, async (req, res) => {
  try {
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: true },
    });

    if (!owner.establishments.length) return res.status(400).json({ error: "Owner não tem empresa" });

    const establishment = owner.establishments[0];

    const products = await prisma.product.findMany({
      where: { establishmentId: establishment.id },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
