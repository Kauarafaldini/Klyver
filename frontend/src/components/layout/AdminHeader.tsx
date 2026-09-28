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
  ChevronDown,
  Shield,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { useTheme } from "@/lib/theme-context";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

export const AdminHeader: React.FC = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header className="bg-card/95 dark:bg-card/95 backdrop-blur-sm border-b border-border/80 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 dark:border-primary/40 dark:text-primary font-medium"
            >
              <Shield className="w-3 h-3 mr-1" />
              Super Admin
            </Badge>
            <div className="text-sm text-muted-foreground">
              Sessão segura ativa
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative p-2 text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground font-bold">
                  3
                </Badge>
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-2 hover:bg-primary/10 dark:hover:bg-accent/40"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-sm">
                        {adminUser ? getInitials(adminUser.nome) : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-medium text-foreground">
                        {adminUser?.nome}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Administrador
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Conta do Administrador</DropdownMenuLabel>
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
                <DropdownMenuItem
                  onClick={adminLogout}
                  className="text-red-600 dark:text-red-400 font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair do Admin</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <FloatingThemeToggle />
    </>
  );
};
