import prisma from "../lib/prisma.js";

// Função para verificar estoque baixo e criar alerta
export async function checkLowStock(productId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return;

  if (product.currentStock <= product.minStock) {
    await prisma.low_stock_alerts.create({
      data: { productId },
    });
  }
}
