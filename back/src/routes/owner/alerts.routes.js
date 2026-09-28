import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/role.js";
import logger from "../../utils/logger.js";

const router = Router();
const requireOwner = requireRole("OWNER");

router.get("/low-stock", authenticate, requireOwner, async (req, res) => {
  try {
    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: { include: { products: true } } },
    });

    if (!owner.establishments.length) return res.status(400).json({ error: "Owner não tem empresa" });

    const establishment = owner.establishments[0];

    const lowStockProducts = await prisma.product.findMany({
      where: {
        establishmentId: establishment.id,
        currentStock: { lte: prisma.product.fields.minStock }, // abaixo do mínimo
      },
    });

    return res.json({ lowStockProducts });
  } catch (error) {
    logger.error("Erro ao buscar alertas de estoque", { error: error.message });
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
