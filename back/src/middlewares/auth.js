import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

/**
 * Lê o accessToken do cookie HttpOnly (produção) ou
 * do header Authorization: Bearer <token> (dev / compatibilidade).
 */
export function authenticate(req, res, next) {
  const token =
    req.cookies?.accessToken ??
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn("Token inválido", { message: err.message });
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
