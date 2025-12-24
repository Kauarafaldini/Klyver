import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  res.json({ message: "Login funcionando" });
});

router.post("/register", (req, res) => {
  res.json({ message: "Register funcionando" });
});

export default router;