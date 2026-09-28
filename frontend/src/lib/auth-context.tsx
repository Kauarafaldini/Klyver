import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Cliente } from "./types";
import { API_URL, apiRequest } from "./api";

interface AuthContextType {
  user: User | null;
  cliente: Cliente | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("@klyver:user");
    const token = localStorage.getItem("@klyver:token");
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          id: parsed.id,
          nome: parsed.name || parsed.nome || "Usuário",
          email: parsed.email,
          tipo: parsed.role === "ADMIN" ? "admin" : "funcionario",
          cliente_id: parsed.id,
        });
      } catch (e) {
        localStorage.removeItem("@klyver:user");
        localStorage.removeItem("@klyver:token");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // O backend vai setar os cookies HttpOnly automaticamente
      const data = await apiRequest<{
        user: { id: string; name: string; email: string; role: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Persiste apenas dados não-sensíveis (sem token)
      localStorage.setItem("@klyver:user", JSON.stringify(data.user));

      setUser({
        id: data.user.id,
        nome: data.user.name,
        email: data.user.email,
        tipo: data.user.role === "ADMIN" ? "admin" : "funcionario",
        cliente_id: data.user.id,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Limpa dados locais do usuário
    localStorage.removeItem("@klyver:user");
    setUser(null);
    setCliente(null);
    // Limpa os cookies no servidor
    fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  };

  const value: AuthContextType = {
    user,
    cliente,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
