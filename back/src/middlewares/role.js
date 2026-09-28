/**
 * Middleware de autorização por role.
 * Uso: requireRole("ADMIN")  /  requireRole("OWNER", "ADMIN")
 *
 * Deve ser usado APÓS o middleware `authenticate` que popula req.user.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: `Acesso negado. Role necessário: ${allowedRoles.join(" | ")}`,
      });
    }

    next();
  };
}
