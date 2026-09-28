import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  Database,
  HelpCircle,
} from "lucide-react";
import { mockClientes } from "@/lib/admin-mock-data";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral do SaaS",
  },
  {
    name: "Clientes",
    href: "/admin/clientes",
    icon: Users,
    description: "Gestão de clientes",
    badge: mockClientes.filter((c) => c.ativo).length,
  },
  {
    name: "Planos & Cobrança",
    href: "/admin/planos",
    icon: CreditCard,
    description: "Configurar planos",
  },
  {
    name: "Módulos",
    href: "/admin/modulos",
    icon: Database,
    description: "Controle de recursos",
  },
  {
    name: "Relatórios",
    href: "/admin/relatorios",
    icon: BarChart3,
    description: "Analytics e métricas",
  },
  {
    name: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
    description: "Config. do sistema",
  },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-card/95 dark:bg-card/95 backdrop-blur-sm border-r border-border/80 shadow-lg relative">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground font-medium">SaaS Management</p>
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
                  "hover:bg-primary/10 hover:text-primary dark:hover:bg-muted dark:hover:text-foreground",
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-accent/15 dark:from-primary/25 dark:to-accent/25 text-primary dark:text-primary-foreground shadow-sm border border-primary/30 dark:border-primary/40 font-semibold"
                    : "text-muted-foreground hover:text-foreground",
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

      {/* Help Section */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/15 dark:to-accent/15 rounded-lg p-4 border border-primary/30">
          <div className="flex items-center space-x-2 mb-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Suporte</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Precisa de ajuda com o painel administrativo?
          </p>
          <Button variant="outline" size="sm" className="w-full font-medium">
            Contatar Suporte
          </Button>
        </div>
      </div>
    </div>
  );
};
