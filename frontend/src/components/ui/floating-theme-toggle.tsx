import React from "react";
import { Button } from "./button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface FloatingThemeToggleProps {
  className?: string;
}

export const FloatingThemeToggle: React.FC<FloatingThemeToggleProps> = ({
  className,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full",
        "bg-gradient-to-r from-primary/90 to-accent/90 border-primary/50",
        "hover:from-primary hover:to-accent hover:border-primary",
        "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40",
        "backdrop-blur-sm transition-all duration-300 hover:scale-110",
        "dark:from-primary/80 dark:to-accent/80 dark:shadow-primary/20",
        className,
      )}
      onClick={toggleTheme}
      title={`Alternar para modo ${theme === "light" ? "escuro" : "claro"}`}
    >
      <Sun className="w-6 h-6 text-white rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-6 h-6 text-white rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
};
