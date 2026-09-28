import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  ChefHat,
  ShoppingCart,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Settings,
  MessageSquare,
  Store,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useModules } from "@/hooks/use-modules";
import { mockAlertasEstoque } from "@/lib/mock-data";

const allNavigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Visão geral do negócio",
    module: null, // Always available
  },
  {
    name: "Produtos",
    href: "/produtos",
    icon: Package,
    description: "Gestão de estoque",
    module: "produtos" as const,
    badge:
      mockAlertasEstoque.length > 0 ? mockAlertasEstoque.length : undefined,
  },
  {
    name: "Receitas",
    href: "/receitas",
    icon: ChefHat,
    description: "Cardápio e receitas",
    module: "receitas" as const,
  },
  {
    name: "Vendas",
    href: "/vendas",
    icon: ShoppingCart,
    description: "Ponto de venda",
    module: "vendas" as const,
  },
  {
    name: "Compras",
    href: "/compras",
    icon: Receipt,
    description: "Entrada de produtos",
    module: "compras" as const,
  },
  {
    name: "Financeiro",
    href: "/financeiro",
    icon: TrendingUp,
    description: "Relatórios e análises",
    module: "financeiro" as const,
  },
  {
    name: "Alertas",
    href: "/alertas",
    icon: AlertTriangle,
    description: "Notificações importantes",
    module: "alertas" as const,
    badge: mockAlertasEstoque.length,
  },
  {
    name: "WhatsApp",
    href: "/whatsapp",
    icon: MessageSquare,
    description: "Integração WhatsApp",
    module: "whatsapp" as const,
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { cliente } = useAuth();
  const { isModuleActive } = useModules();

  // Filter navigation items based on active modules
  const navigationItems = allNavigationItems.filter((item) => {
    if (!item.module) return true; // Always show items without module requirement
    return isModuleActive(item.module);
  });

  return (
    <div className="w-64 bg-card/95 dark:bg-card/95 backdrop-blur-sm border-r border-border/80 shadow-lg relative">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-restaurant-500 to-restaurant-600 rounded-xl shadow-md">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-restaurant-900 dark:text-foreground">
              {cliente?.nome_fantasia || "Restaurant"}
            </h1>
            <p className="text-xs text-restaurant-600 dark:text-muted-foreground font-medium">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 transition-all duration-200",
                  "hover:bg-restaurant-50 dark:hover:bg-accent/40 hover:text-restaurant-800 dark:hover:text-foreground",
                  isActive
                    ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground shadow-sm border border-primary/25 dark:border-primary/40 font-semibold"
                    : "text-restaurant-700 dark:text-muted-foreground",
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs opacity-80">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-primary text-primary-foreground ml-2 font-semibold"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="absolute bottom-4 left-4 right-4">
        <Link to="/configuracoes">
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 text-restaurant-700 dark:text-muted-foreground hover:bg-restaurant-50 dark:hover:bg-accent/40 hover:text-restaurant-800 dark:hover:text-foreground border border-transparent hover:border-border/60"
          >
            <Settings className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium text-sm">Configurações</div>
              <div className="text-xs opacity-80">Ajustes do sistema</div>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};
