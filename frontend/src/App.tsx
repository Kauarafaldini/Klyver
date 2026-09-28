import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";
import { AuthProvider } from "@/lib/auth-context";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Recipes from "./pages/Recipes";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import FinancialReports from "./pages/FinancialReports";
import Alerts from "./pages/Alerts";
import WhatsApp from "./pages/WhatsApp";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientManagement from "./pages/admin/ClientManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="clientes" element={<ClientManagement />} />
                  <Route
                    path="planos"
                    element={<PlaceholderPage title="Planos & Cobrança" />}
                  />
                  <Route
                    path="modulos"
                    element={<PlaceholderPage title="Gestão de Módulos" />}
                  />
                  <Route
                    path="relatorios"
                    element={<PlaceholderPage title="Relatórios Admin" />}
                  />
                  <Route
                    path="configuracoes"
                    element={<PlaceholderPage title="Config. Sistema" />}
                  />
                </Route>

                {/* Client Routes */}
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="produtos" element={<Products />} />
                  <Route path="receitas" element={<Recipes />} />
                  <Route path="vendas" element={<Sales />} />
                  <Route path="compras" element={<Purchases />} />
                  <Route path="financeiro" element={<FinancialReports />} />
                  <Route path="alertas" element={<Alerts />} />
                  <Route path="whatsapp" element={<WhatsApp />} />
                  <Route path="configuracoes" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
