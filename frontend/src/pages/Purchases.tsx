import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Receipt,
  TrendingUp,
  Package,
  Truck,
  Calendar,
  Minus,
  Eye,
} from "lucide-react";
import { mockProdutos } from "@/lib/mock-data";
import { Compra, CompraItem, Produto } from "@/lib/types";

interface PurchaseItem {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  produto?: Produto;
}

// Mock data for purchases
const mockCompras: Compra[] = [
  {
    id: "compra_001",
    data: new Date("2024-01-10T10:00:00"),
    valor_total: 450.0,
    fornecedor: "Distribuidora Central",
    numero_nota: "NF-001234",
    cliente_id: "cliente_001",
    itens: [
      {
        id: "ci_001",
        compra_id: "compra_001",
        produto_id: "prod_001",
        quantidade: 100,
        preco_unitario: 1.3,
        cliente_id: "cliente_001",
      },
      {
        id: "ci_002",
        compra_id: "compra_001",
        produto_id: "prod_002",
        quantidade: 50,
        preco_unitario: 7.5,
        cliente_id: "cliente_001",
      },
    ],
  },
  {
    id: "compra_002",
    data: new Date("2024-01-15T14:30:00"),
    valor_total: 280.0,
    fornecedor: "Atacadão de Bebidas",
    numero_nota: "NF-005678",
    cliente_id: "cliente_001",
    itens: [
      {
        id: "ci_003",
        compra_id: "compra_002",
        produto_id: "prod_007",
        quantidade: 120,
        preco_unitario: 2.0,
        cliente_id: "cliente_001",
      },
    ],
  },
];

export default function Purchases() {
  const [compras, setCompras] = useState<Compra[]>(mockCompras);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const PurchaseForm = ({ compra }: { compra?: Compra }) => {
    const [formData, setFormData] = useState({
      data_compra: compra?.data
        ? compra.data.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      fornecedor: compra?.fornecedor || "",
      numero_nota: compra?.numero_nota || "",
      itens: compra?.itens || [],
    });

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [precoUnitario, setPrecoUnitario] = useState(0);

    const adicionarItem = () => {
      if (!selectedProduct || quantidade <= 0 || precoUnitario <= 0) return;

      const produto = mockProdutos.find((p) => p.id === selectedProduct);
      if (!produto) return;

      const novoItem: CompraItem = {
        id: `ci_${Date.now()}`,
        compra_id: compra?.id || "",
        produto_id: selectedProduct,
        quantidade,
        preco_unitario: precoUnitario,
        cliente_id: "cliente_001",
        produto,
      };

      setFormData({
        ...formData,
        itens: [...formData.itens, novoItem],
      });

      setSelectedProduct("");
      setQuantidade(1);
      setPrecoUnitario(0);
    };

    const removerItem = (index: number) => {
      const novosItens = formData.itens.filter((_, i) => i !== index);
      setFormData({ ...formData, itens: novosItens });
    };

    const valorTotal = formData.itens.reduce(
      (total, item) => total + item.quantidade * item.preco_unitario,
      0,
    );

    const handleSubmit = () => {
      // Simular criação de compra
      const novaCompra: Compra = {
        id: `compra_${Date.now()}`,
        data: new Date(formData.data_compra),
        valor_total: valorTotal,
        fornecedor: formData.fornecedor,
        numero_nota: formData.numero_nota,
        cliente_id: "cliente_001",
        itens: formData.itens,
      };

      // Atualizar estoque dos produtos
      formData.itens.forEach((item) => {
        // Aqui seria onde atualizaríamos o estoque real
        console.log(
          `Adicionando ${item.quantidade} unidades ao estoque do produto ${item.produto_id}`,
        );
      });

      // Gerar despesa automática
      console.log("Gerando despesa automática:", {
        tipo: "Compra de produtos",
        valor: valorTotal,
        data: formData.data_compra,
        fornecedor: formData.fornecedor,
      });

      setCompras([...compras, novaCompra]);
      alert(
        "Compra registrada com sucesso! Estoque atualizado e despesa gerada.",
      );
    };

    return (
      <form className="space-y-6">
        {/* Informações da Compra */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações da Compra</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="data_compra">Data da Compra</Label>
              <Input
                id="data_compra"
                type="date"
                value={formData.data_compra}
                onChange={(e) =>
                  setFormData({ ...formData, data_compra: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) =>
                  setFormData({ ...formData, fornecedor: e.target.value })
                }
                placeholder="Nome do fornecedor"
              />
            </div>
            <div>
              <Label htmlFor="numero_nota">Número da Nota Fiscal</Label>
              <Input
                id="numero_nota"
                value={formData.numero_nota}
                onChange={(e) =>
                  setFormData({ ...formData, numero_nota: e.target.value })
                }
                placeholder="NF-123456"
              />
            </div>
          </div>
        </div>

        {/* Adicionar Produtos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Produtos Comprados</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Produto</Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {mockProdutos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.unidade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label>Preço Unitário</Label>
              <Input
                type="number"
                step="0.01"
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(parseFloat(e.target.value))}
                min="0"
                placeholder="0.00"
              />
            </div>
            <Button
              type="button"
              onClick={adicionarItem}
              disabled={
                !selectedProduct || quantidade <= 0 || precoUnitario <= 0
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Lista de Itens */}
          {formData.itens.length > 0 && (
            <div className="border rounded-lg p-4">
              <div className="space-y-2">
                {formData.itens.map((item, index) => {
                  const produto = mockProdutos.find(
                    (p) => p.id === item.produto_id,
                  );
                  const subtotal = item.quantidade * item.preco_unitario;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{produto?.nome}</span>
                        <div className="text-sm text-gray-600">
                          {item.quantidade} {produto?.unidade} ×{" "}
                          {formatCurrency(item.preco_unitario)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatCurrency(subtotal)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(valorTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={formData.itens.length === 0}
          >
            Registrar Compra
          </Button>
        </div>
      </form>
    );
  };

  const filteredCompras = compras.filter((compra) => {
    const matchesSearch =
      compra.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.numero_nota?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" &&
        compra.data.toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" &&
        compra.data >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesDate;
  });

  const totalCompras = compras.reduce(
    (sum, compra) => sum + compra.valor_total,
    0,
  );
  const comprasEsteMes = compras.filter(
    (compra) =>
      compra.data.getMonth() === new Date().getMonth() &&
      compra.data.getFullYear() === new Date().getFullYear(),
  );
  const totalEsteMes = comprasEsteMes.reduce(
    (sum, compra) => sum + compra.valor_total,
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gestão de Compras
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre compras, atualize estoque e controle despesas
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nova Compra</DialogTitle>
            </DialogHeader>
            <PurchaseForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compras.length}</div>
            <p className="text-xs text-muted-foreground">compras registradas</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalEsteMes)}
            </div>
            <p className="text-xs text-muted-foreground">
              {comprasEsteMes.length} compras
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCompras)}
            </div>
            <p className="text-xs text-muted-foreground">valor acumulado</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(compras.map((c) => c.fornecedor)).size}
            </div>
            <p className="text-xs text-muted-foreground">fornecedores únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por fornecedor ou nota fiscal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as datas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle>Histórico de Compras ({filteredCompras.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Nota Fiscal</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompras.map((compra) => (
                <TableRow key={compra.id} className="hover:bg-primary/5">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(compra.data)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{compra.fornecedor}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{compra.numero_nota}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary">
                      {compra.itens.length} produto
                      {compra.itens.length !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(compra.valor_total)}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-success-100 text-success-800">
                      Processada
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
