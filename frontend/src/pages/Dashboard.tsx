import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Users,
  Package,
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
import { mockDashboardMetrics, mockRelatorioFinanceiro } from "@/lib/mock-data";

const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

export default function Dashboard() {
  const metrics = mockDashboardMetrics;
  const relatorio = mockRelatorioFinanceiro;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const pieData = Object.entries(relatorio.despesas_por_categoria).map(
    ([categoria, valor]) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      value: valor,
    }),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-900">Dashboard</h1>
          <p className="text-restaurant-600 mt-1">
            Visão geral do seu negócio em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className="border-success-200 text-success-700"
          >
            Sistema Online
          </Badge>
          <Button>Nova Venda</Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-restaurant-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Vendas Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-900">
              {metrics.vendas_hoje}
            </div>
            <div className="flex items-center text-sm text-success-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs ontem
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-restaurant-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Faturamento Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-900">
              {formatCurrency(metrics.faturamento_hoje)}
            </div>
            <div className="flex items-center text-sm text-success-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% vs ontem
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-restaurant-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Ticket Médio
            </CardTitle>
            <Users className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-900">
              {formatCurrency(metrics.ticket_medio)}
            </div>
            <div className="flex items-center text-sm text-warning-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% vs semana
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-red-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Estoque Baixo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {metrics.produtos_baixo_estoque}
            </div>
            <div className="text-sm text-red-600 mt-1">
              Produtos precisam reposição
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 glass border-restaurant-200/50">
          <CardHeader>
            <CardTitle className="text-restaurant-900">
              Vendas dos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={relatorio.vendas_por_dia}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="salesGradient"
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
                <XAxis
                  dataKey="data"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  }
                  axisLine={true}
                  tickLine={true}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  axisLine={true}
                  tickLine={true}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses Pie Chart */}
        <Card className="glass border-restaurant-200/50">
          <CardHeader>
            <CardTitle className="text-restaurant-900">
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-restaurant-700">
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card className="glass border-restaurant-200/50">
          <CardHeader>
            <CardTitle className="text-restaurant-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={metrics.horarios_pico}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="horario" axisLine={true} tickLine={true} />
                <YAxis axisLine={true} tickLine={true} />
                <Bar dataKey="vendas" fill="#8b5cf6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="glass border-restaurant-200/50">
          <CardHeader>
            <CardTitle className="text-restaurant-900 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.produtos_mais_vendidos.map((produto, index) => (
                <div key={produto.nome} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center border-restaurant-300 text-restaurant-700"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-restaurant-900">
                      {produto.nome}
                    </div>
                    <div className="text-sm text-restaurant-600">
                      {produto.quantidade} vendidos
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 bg-restaurant-100 rounded-full h-2">
                      <div
                        className="bg-restaurant-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (produto.quantidade /
                              Math.max(
                                ...metrics.produtos_mais_vendidos.map(
                                  (p) => p.quantidade,
                                ),
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
