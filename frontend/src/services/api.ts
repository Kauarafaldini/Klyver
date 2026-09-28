// Base URL da API vinda da variável de ambiente (Vite) ou fallback para localhost
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Utilitário para realizar requisições HTTP autenticadas com JWT via cookie.
 * O accessToken é enviado automaticamente pelo browser (httpOnly cookie).
 * O front-end não armazena o token – isso elimina a exposição por XSS.
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // ← envia o cookie HttpOnly automaticamente
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Token expirado: tenta refresh silencioso
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshed.ok) {
        const retry = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: "include",
        });
        if (retry.ok) return retry.json() as Promise<T>;
      }
    }
    throw new Error((data as any).error || "Ocorreu um erro na requisição");
  }

  return data as T;
}
