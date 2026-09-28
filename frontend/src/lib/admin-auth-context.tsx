import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AdminUser } from "./types";
import { apiRequest } from "./api";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

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

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("@klyver:user");
    const token = localStorage.getItem("@klyver:token");
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === "ADMIN") {
          setAdminUser({
            id: parsed.id,
            nome: parsed.name || parsed.nome || "Administrador",
            email: parsed.email,
            tipo: "super_admin",
            token,
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const adminLogin = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const data = await apiRequest<{
        token: string;
        user: { id: string; name: string; email: string; role: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user.role !== "ADMIN") {
        throw new Error("Acesso negado: Este usuário não é administrador");
      }

      localStorage.setItem("@klyver:token", data.token);
      localStorage.setItem("@klyver:user", JSON.stringify(data.user));

      setAdminUser({
        id: data.user.id,
        nome: data.user.name,
        email: data.user.email,
        tipo: "super_admin",
        token: data.token,
      });

      return true;
    } catch (error) {
      console.error("Admin login failed:", error);
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem("@klyver:token");
    localStorage.removeItem("@klyver:user");
    setAdminUser(null);
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
