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
 * Criar receita
 */
router.post("/", authenticate, requireOwner, async (req, res) => {
  try {
    const { name, prepTime, description, salePrice, ingredients } = req.body;

    if (!name || !ingredients || !ingredients.length) {
      return res.status(400).json({ error: "Nome e ingredientes são obrigatórios" });
    }

    // Buscar empresa do Owner
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: true },
    });

    if (!owner.establishments.length) return res.status(400).json({ error: "Owner não tem empresa" });

    const establishment = owner.establishments[0];

    // Validar produtos
    const productIds = ingredients.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        establishmentId: establishment.id,
      },
    });

    if (products.length !== ingredients.length) {
      return res.status(400).json({ error: "Algum produto não existe ou não pertence à empresa" });
    }

    // Criar receita com ingredients
    const recipe = await prisma.recipe.create({
      data: {
        establishmentId: establishment.id,
        name,
        prepTime,
        description,
        salePrice,
        ingredients: {
          create: ingredients.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      include: {
        ingredients: { include: { product: true } },
      },
    });

    return res.status(201).json({ message: "Receita criada", recipe });
  } catch (error) {
    console.error("Erro criando receita:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * Listar receitas da empresa
 */
router.get("/", authenticate, requireOwner, async (req, res) => {
  try {
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: true },
    });

    if (!owner.establishments.length) return res.status(400).json({ error: "Owner não tem empresa" });

    const establishment = owner.establishments[0];

    const recipes = await prisma.recipe.findMany({
      where: { establishmentId: establishment.id },
      include: { ingredients: { include: { product: true } } },
    });

    return res.json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
