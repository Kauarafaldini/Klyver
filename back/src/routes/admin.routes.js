import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";

const router = Router();

router.get("/test", authenticate, requireRole("ADMIN"), (req, res) => {
  res.json({ message: "Admin autorizado" });
});

export default router;
