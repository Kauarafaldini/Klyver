import { useAuth } from "@/lib/auth-context";
import { ModulosAtivos } from "@/lib/types";

export const useModules = () => {
  const { cliente } = useAuth();

  const isModuleActive = (module: keyof ModulosAtivos): boolean => {
    if (!cliente?.modulos_ativos) return false;
    return cliente.modulos_ativos[module];
  };

  const getActiveModules = (): (keyof ModulosAtivos)[] => {
    if (!cliente?.modulos_ativos) return [];
    return Object.entries(cliente.modulos_ativos)
      .filter(([_, isActive]) => isActive)
      .map(([module, _]) => module as keyof ModulosAtivos);
  };

  const getInactiveModules = (): (keyof ModulosAtivos)[] => {
    if (!cliente?.modulos_ativos) return [];
    return Object.entries(cliente.modulos_ativos)
      .filter(([_, isActive]) => !isActive)
      .map(([module, _]) => module as keyof ModulosAtivos);
  };

  const getTotalActiveModules = (): number => {
    if (!cliente?.modulos_ativos) return 0;
    return Object.values(cliente.modulos_ativos).filter(Boolean).length;
  };

  return {
    isModuleActive,
    getActiveModules,
    getInactiveModules,
    getTotalActiveModules,
    modulosAtivos: cliente?.modulos_ativos,
  };
};
