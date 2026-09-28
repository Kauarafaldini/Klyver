import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useModules } from "@/hooks/use-modules";
import { mockAlertasEstoque } from "@/lib/mock-data";

export const Header: React.FC = () => {
  const { user, cliente, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { getTotalActiveModules } = useModules();
  const alertsCount = mockAlertasEstoque.length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-card/95 dark:bg-card/95 backdrop-blur-sm border-b border-border/80 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Client info and modules */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <div className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {cliente?.nome_fantasia || "Sistema"}
            </div>
            <div className="text-sm text-muted-foreground">
              Bem-vindo, <span className="font-medium text-foreground">{user?.nome}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/30 text-primary dark:border-primary/40 dark:text-primary hidden lg:flex font-medium"
          >
            {getTotalActiveModules()} módulos ativos
          </Badge>
          {cliente?.valor_plano && (
            <Badge variant="secondary" className="hidden lg:flex font-medium">
              Plano:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(cliente.valor_plano)}
            </Badge>
          )}
        </div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative p-2 text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5 text-restaurant-600 dark:text-muted-foreground" />
              {alertsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold">
                  {alertsCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:from-primary/20 hover:to-accent/20 hover:border-primary/50 transition-all duration-300"
            onClick={toggleTheme}
            title={`Alternar para modo ${theme === "light" ? "escuro" : "claro"}`}
          >
            <Sun className="w-5 h-5 text-primary rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-5 h-5 text-primary rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-2 hover:bg-restaurant-50 dark:hover:bg-accent/40"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary-foreground text-sm font-semibold border border-primary/20">
                      {user ? getInitials(user.nome) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium text-restaurant-900 dark:text-foreground">
                      {user?.nome}
                    </div>
                    <div className="text-xs text-restaurant-600 dark:text-muted-foreground capitalize">
                      {user?.tipo}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-restaurant-600 dark:text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 font-medium">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
