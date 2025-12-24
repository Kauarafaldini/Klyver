import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";

const router = Router();

// Middleware que garante que é OWNER
function requireOwner(req, res, next) {
  if (req.user.role !== "OWNER") {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}

/**
 * Resumo do plano do Owner
 */
router.get("/summary", authenticate, requireOwner, async (req, res) => {
  try {
    // Pega a empresa do owner
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        establishments: {
          include: {
            plan: true,
            employees: true,
            products: true,
          },
        },
      },
    });

    if (!owner.establishments.length) {
      return res.status(400).json({ error: "Owner não possui empresa" });
    }

    const establishment = owner.establishments[0];

    // Contagem de alertas de estoque baixo
    const lowStockAlerts = await prisma.lowStockAlert.count({
      where: { product: { establishmentId: establishment.id }, resolved: false },
    });

    return res.json({
      companyName: establishment.companyName,
      fantasyName: establishment.fantasyName,
      plan: {
        name: establishment.plan.name,
        maxEmployees: establishment.plan.maxEmployees,
        currentEmployees: establishment.employees.length,
        maxProducts: establishment.plan.maxProducts,
        currentProducts: establishment.products.length,
      },
      lowStockAlerts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
