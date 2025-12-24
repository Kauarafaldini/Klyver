// src/routes/admin/logs.routes.js
import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { authenticate } from "../../middlewares/auth.js";

const router = Router();

function requireAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Acesso negado" });
  next();
}

router.get("/", authenticate, requireAdmin, async (req, res) => {
  const logs = await prisma.logs.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(logs);
});

export default router;
