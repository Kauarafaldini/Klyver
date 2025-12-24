import prisma from "../lib/prisma.js";

// Verifica se o Owner pode adicionar mais funcionários
export async function canAddEmployee(ownerId) {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    include: {
      establishments: {
        include: { plan: true, employees: true },
      },
    },
  });

  if (!owner.establishments.length) return false;

  const establishment = owner.establishments[0];
  const plan = establishment.plan;

  // Se maxEmployees for null, não há limite
  if (plan.maxEmployees !== null && establishment.employees.length >= plan.maxEmployees) {
    return false;
  }
  return true;
}

// Verifica se o Owner pode adicionar mais produtos
export async function canAddProduct(ownerId) {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    include: {
      establishments: {
        include: { plan: true, products: true },
      },
    },
  });

  if (!owner.establishments.length) return false;

  const establishment = owner.establishments[0];
  const plan = establishment.plan;

  // Se maxProducts for null, não há limite
  if (plan.maxProducts !== null && establishment.products.length >= plan.maxProducts) {
    return false;
  }
  return true;
}
