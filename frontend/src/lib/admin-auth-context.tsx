import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AdminUser } from "./types";
import { apiRequest, API_URL } from "./api";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Restaura dados do usuário (sem token – gerenciado pelo cookie HttpOnly)
    const savedUser = localStorage.getItem("@klyver:user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === "ADMIN") {
          setAdminUser({
            id: parsed.id,
            nome: parsed.name || parsed.nome || "Administrador",
            email: parsed.email,
            tipo: "super_admin",
            token: "", // token está no cookie, não aqui
          });
        }
      } catch {
        localStorage.removeItem("@klyver:user");
      }
    }
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // Backend seta os cookies HttpOnly automaticamente
      const data = await apiRequest<{
        user: { id: string; name: string; email: string; role: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user.role !== "ADMIN") {
        throw new Error("Acesso negado: Este usuário não é administrador");
      }

      // Persiste apenas dados não-sensíveis (o token fica no cookie)
      localStorage.setItem("@klyver:user", JSON.stringify(data.user));

      setAdminUser({
        id: data.user.id,
        nome: data.user.name,
        email: data.user.email,
        tipo: "super_admin",
        token: "",
      });

      return true;
    } catch (error) {
      console.error("Admin login failed:", error);
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem("@klyver:user");
    setAdminUser(null);
    // Limpa os cookies no servidor
    fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  };

  const value: AdminAuthContextType = {
    adminUser,
    isAdminAuthenticated: !!adminUser,
    adminLogin,
    adminLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
