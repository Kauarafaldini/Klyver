import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";

const router = Router();

function requireOwner(req, res, next) {
  if (req.user.role !== "OWNER") return res.status(403).json({ error: "Acesso negado" });
  next();
}

// Registrar compra
router.post("/", authenticate, requireOwner, async (req, res) => {
  try {
    const { productId, quantity, unitPrice, supplier, invoiceNumber } = req.body;

    const owner = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { establishments: true },
    });

    if (!owner.establishments.length) return res.status(400).json({ error: "Owner não tem empresa" });

    const establishment = owner.establishments[0];

    // Verifica se o produto pertence à empresa
    const product = await prisma.product.findFirst({
      where: { id: productId, establishmentId: establishment.id },
    });
    if (!product) return res.status(400).json({ error: "Produto não encontrado na empresa" });

    // Criar compra
    const purchase = await prisma.purchase.create({
      data: {
        establishmentId: establishment.id,
        productId,
        quantity,
        unitPrice,
        supplier,
        invoiceNumber,
        purchaseDate: new Date(),
      },
    });

    // Atualizar estoque do produto
    await prisma.product.update({
      where: { id: productId },
      data: { currentStock: product.currentStock + quantity },
    });

    return res.status(201).json({ message: "Compra registrada", purchase });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
