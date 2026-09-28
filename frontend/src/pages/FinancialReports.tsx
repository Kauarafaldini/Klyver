import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { mockRelatorioFinanceiro, mockDashboardMetrics } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

// Mock data for detailed financial analysis
const mockVendasDetalhadas = [
  { data: "01/01", vendas: 1250, quantidade: 15 },
  { data: "02/01", vendas: 1100, quantidade: 12 },
  { data: "03/01", vendas: 1350, quantidade: 18 },
  { data: "04/01", vendas: 980, quantidade: 11 },
  { data: "05/01", vendas: 1450, quantidade: 19 },
  { data: "06/01", vendas: 1200, quantidade: 14 },
  { data: "07/01", vendas: 1600, quantidade: 22 },
  { data: "08/01", vendas: 1350, quantidade: 16 },
  { data: "09/01", vendas: 1100, quantidade: 13 },
  { data: "10/01", vendas: 1750, quantidade: 25 },
];

const mockDespesasDetalhadas = [
  { categoria: "Compra de produtos", valor: 2800, percentual: 45 },
  { categoria: "Plano SaaS", valor: 89.9, percentual: 1.4 },
  { categoria: "Salários", valor: 2200, percentual: 35.5 },
  { categoria: "Energia", valor: 320, percentual: 5.2 },
  { categoria: "Aluguel", valor: 800, percentual: 12.9 },
];

const mockVendasPorTipo = [
  { tipo: "Receitas", valor: 8500, quantidade: 85, percentual: 68 },
  { tipo: "Produtos Simples", valor: 4000, quantidade: 120, percentual: 32 },
];

export default function FinancialReports() {
  const { cliente } = useAuth();
  const [periodoInicio, setPeriodoInicio] = useState("2024-01-01");
  const [periodoFim, setPeriodoFim] = useState("2024-01-31");
  const [tipoRelatorio, setTipoRelatorio] = useState("geral");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calcularSaldo = () => {
    const totalVendas = mockVendasDetalhadas.reduce(
      (sum, item) => sum + item.vendas,
      0,
    );
    const totalDespesas = mockDespesasDetalhadas.reduce(
      (sum, item) => sum + item.valor,
      0,
    );
    return totalVendas - totalDespesas;
  };

  const saldoFinal = calcularSaldo();
  const totalVendas = mockVendasDetalhadas.reduce(
    (sum, item) => sum + item.vendas,
    0,
  );
  const totalDespesas = mockDespesasDetalhadas.reduce(
    (sum, item) => sum + item.valor,
    0,
  );
  const ticketMedio = totalVendas / mockVendasDetalhadas.length;

  const exportarRelatorio = (formato: "pdf" | "excel") => {
    // Simular exportação
    alert(
      `Exportando relatório em ${formato.toUpperCase()}... (funcionalidade simulada)`,
    );
  };

  const pieDataDespesas = mockDespesasDetalhadas.map((item) => ({
    name: item.categoria,
    value: item.valor,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Relatórios Financeiros
          </h1>
          <p className="text-muted-foreground mt-1">
            {cliente?.nome_fantasia} - Análise completa de vendas e despesas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportarRelatorio("excel")}
            className="bg-green-50 hover:bg-green-100 border-green-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => exportarRelatorio("pdf")}
            className="bg-red-50 hover:bg-red-100 border-red-200"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="inicio">Data Início</Label>
              <Input
                id="inicio"
                type="date"
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fim">Data Fim</Label>
              <Input
                id="fim"
                type="date"
                value={periodoFim}
                onChange={(e) => setPeriodoFim(e.target.value)}
              />
            </div>
            <div>
              <Label>Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Relatório Geral</SelectItem>
                  <SelectItem value="vendas">Apenas Vendas</SelectItem>
                  <SelectItem value="despesas">Apenas Despesas</SelectItem>
                  <SelectItem value="produtos">Por Produto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-700">
              {formatCurrency(totalVendas)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockVendasDetalhadas.reduce(
                (sum, item) => sum + item.quantidade,
                0,
              )}{" "}
              vendas no período
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(totalDespesas)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockDespesasDetalhadas.length} categorias de despesa
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(ticketMedio)}
            </div>
            <p className="text-xs text-muted-foreground">por venda</p>
          </CardContent>
        </Card>

        <Card
          className={`glass border-primary/20 ${
            saldoFinal < 0
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
            {saldoFinal < 0 ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-success-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                saldoFinal < 0 ? "text-red-700" : "text-success-700"
              }`}
            >
              {formatCurrency(saldoFinal)}
            </div>
            <p className="text-xs text-muted-foreground">
              {saldoFinal < 0 ? "Prejuízo no período" : "Lucro no período"}
            </p>
            {saldoFinal < 0 && (
              <Badge className="bg-red-100 text-red-800 mt-2">
                ⚠️ Atenção necessária
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução de Vendas */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Evolução das Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={mockVendasDetalhadas}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="vendasGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="data" axisLine={true} tickLine={true} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  axisLine={true}
                  tickLine={true}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#vendasGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Despesas */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieDataDespesas}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieDataDespesas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {pieDataDespesas.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground flex-1">
                    {entry.name}
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Tipo */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Vendas por Tipo de Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVendasPorTipo.map((item) => (
                  <TableRow key={item.tipo}>
                    <TableCell className="font-medium">{item.tipo}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(item.valor)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.percentual > 50
                            ? "bg-success-100 text-success-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {item.percentual}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ranking de Despesas */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Ranking de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>% Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDespesasDetalhadas
                  .sort((a, b) => b.valor - a.valor)
                  .map((despesa, index) => (
                    <TableRow key={despesa.categoria}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="w-6 h-6 p-0 text-xs"
                          >
                            {index + 1}
                          </Badge>
                          <span className="font-medium">
                            {despesa.categoria}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(despesa.valor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${despesa.percentual}%` }}
                            />
                          </div>
                          <span className="text-sm">
                            {despesa.percentual.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Margem de Lucro */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle>Análise de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="text-2xl font-bold text-success-700">
                {(((totalVendas - totalDespesas) / totalVendas) * 100).toFixed(
                  1,
                )}
                %
              </div>
              <div className="text-sm text-success-600">Margem de Lucro</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {((totalDespesas / totalVendas) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-600">% de Despesas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {(totalVendas / 30).toFixed(0)}
              </div>
              <div className="text-sm text-purple-600">Vendas/dia (média)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
