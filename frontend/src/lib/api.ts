export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Utilitário para realizar requisições HTTP autenticadas.
 * O token JWT é gerenciado pelo servidor via cookie HttpOnly –
 * o front não precisa ler ou armazenar o token manualmente.
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
    credentials: "include", // envia cookies HttpOnly automaticamente
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Se expirou, tenta renovar via /auth/refresh
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshed.ok) {
        // Repete a requisição original após renovar
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

