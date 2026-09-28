// Base URL da API vinda da variável de ambiente (Vite) ou fallback para localhost
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Utilitário para realizar requisições HTTP autenticadas com JWT
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("@klyver:token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ocorreu um erro na requisição");
  }

  return data;
}
