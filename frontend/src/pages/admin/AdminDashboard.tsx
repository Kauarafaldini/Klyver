import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Plus,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockAdminMetrics, mockClientes } from "@/lib/admin-mock-data";
import { Link } from "react-router-dom";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const metrics = mockAdminMetrics;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const chartData = [
    { mes: "Jan", receita: 2450, clientes: 8 },
    { mes: "Fev", receita: 3200, clientes: 12 },
    { mes: "Mar", receita: 4100, clientes: 15 },
    { mes: "Abr", receita: 4800, clientes: 18 },
    { mes: "Mai", receita: 5500, clientes: 22 },
    { mes: "Jun", receita: 6200, clientes: 25 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Painel Administrativo SaaS
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão completa da plataforma multi-tenant
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className="border-success-200 text-success-700"
          >
            Sistema Operacional
          </Badge>
          <Link to="/admin/clientes/novo">
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-primary/20 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_clientes}</div>
            <div className="flex items-center text-sm text-success-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {metrics.crescimento_mensal}% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-700">
              {metrics.clientes_ativos}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              de {metrics.total_clientes} total
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RMR Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(metrics.receita_mensal_recorrente)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Receita Mensal Recorrente
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-warning-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-700">
              {metrics.taxa_churn}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Cancelamentos mensais
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Crescimento da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="mes" axisLine={true} tickLine={true} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  axisLine={true}
                  tickLine={true}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Usage Chart */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Módulos Mais Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics.modulos_mais_usados}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="modulo" axisLine={true} tickLine={true} />
                <YAxis axisLine={true} tickLine={true} />
                <Bar dataKey="uso" fill="#8b5cf6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Plan */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Receita por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.faturamento_por_plano.map((plano, index) => (
                <div
                  key={plano.plano}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <div className="font-medium">{plano.plano}</div>
                      <div className="text-sm text-muted-foreground">
                        {plano.clientes} cliente
                        {plano.clientes !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(plano.receita)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClientes.slice(0, 4).map((cliente) => (
                <div
                  key={cliente.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{cliente.nome_fantasia}</div>
                    <div className="text-sm text-muted-foreground">
                      {cliente.tipo_empresa}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={cliente.ativo ? "default" : "secondary"}
                      className={cliente.ativo ? "bg-success-500" : "bg-muted"}
                    >
                      {cliente.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/admin/clientes">
                <Button variant="outline" className="w-full">
                  Ver Todos os Clientes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge className="bg-success-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-success-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge className="bg-success-500">85% Free</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup</span>
                <Badge className="bg-warning-500">12h ago</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <Badge className="bg-success-500">99.9%</Badge>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
