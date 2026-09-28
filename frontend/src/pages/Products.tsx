import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Package,
  TrendingDown,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";
import { mockProdutos, mockAlertasEstoque } from "@/lib/mock-data";
import { Produto } from "@/lib/types";

export default function Products() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("estoque");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredAndSortedProducts = produtos
    .filter((produto) => {
      const matchesSearch = produto.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || produto.tipo === filterType;
      const matchesCategory =
        filterCategory === "all" || produto.categoria === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "estoque":
          return a.estoque - b.estoque;
        case "nome":
          return a.nome.localeCompare(b.nome);
        case "preco":
          return b.preco_unitario - a.preco_unitario;
        default:
          return 0;
      }
    });

  const categories = Array.from(
    new Set(produtos.map((p) => p.categoria).filter(Boolean)),
  );

  const totalProducts = produtos.length;
  const lowStockProducts = mockAlertasEstoque.length;
  const totalValue = produtos.reduce(
    (sum, produto) => sum + produto.estoque * produto.preco_unitario,
    0,
  );

  const getStockStatus = (produto: Produto) => {
    if (produto.estoque <= produto.alerta_minimo) {
      return { status: "low", color: "bg-red-100 text-red-800", text: "Baixo" };
    } else if (produto.estoque <= produto.alerta_minimo * 1.5) {
      return {
        status: "medium",
        color: "bg-yellow-100 text-yellow-800",
        text: "Médio",
      };
    } else {
      return {
        status: "good",
        color: "bg-green-100 text-green-800",
        text: "Bom",
      };
    }
  };

  const ProductForm = ({ produto }: { produto?: Produto }) => {
    return (
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome do Produto</Label>
            <Input
              id="nome"
              defaultValue={produto?.nome || ""}
              placeholder="Ex: Pão de Hambúrguer"
            />
          </div>
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select defaultValue={produto?.categoria || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pães">Pães</SelectItem>
                <SelectItem value="Carnes">Carnes</SelectItem>
                <SelectItem value="Laticínios">Laticínios</SelectItem>
                <SelectItem value="Vegetais">Vegetais</SelectItem>
                <SelectItem value="Bebidas">Bebidas</SelectItem>
                <SelectItem value="Molhos">Molhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="estoque">Estoque Atual</Label>
            <Input
              id="estoque"
              type="number"
              defaultValue={produto?.estoque || ""}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="unidade">Unidade</Label>
            <Select defaultValue={produto?.unidade || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="un">Unidades</SelectItem>
                <SelectItem value="kg">Quilogramas</SelectItem>
                <SelectItem value="g">Gramas</SelectItem>
                <SelectItem value="ml">Mililitros</SelectItem>
                <SelectItem value="l">Litros</SelectItem>
                <SelectItem value="fatias">Fatias</SelectItem>
                <SelectItem value="folhas">Folhas</SelectItem>
                <SelectItem value="porções">Porções</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="alerta_minimo">Estoque Mínimo</Label>
            <Input
              id="alerta_minimo"
              type="number"
              defaultValue={produto?.alerta_minimo || ""}
              placeholder="10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="preco_unitario">Preço Unitário</Label>
            <Input
              id="preco_unitario"
              type="number"
              step="0.01"
              defaultValue={produto?.preco_unitario || ""}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select defaultValue={produto?.tipo || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingrediente">Ingrediente</SelectItem>
                <SelectItem value="produto_final">Produto Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição (Opcional)</Label>
          <Input
            id="descricao"
            defaultValue={produto?.descricao || ""}
            placeholder="Descrição do produto..."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button>{produto ? "Atualizar" : "Adicionar"} Produto</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-900">
            Gestão de Produtos
          </h1>
          <p className="text-restaurant-600 mt-1">
            Controle seu estoque e produtos
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-restaurant-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-900">
              {totalProducts}
            </div>
            <p className="text-xs text-restaurant-600 mt-1">
              {produtos.filter((p) => p.tipo === "ingrediente").length}{" "}
              ingredientes,{" "}
              {produtos.filter((p) => p.tipo === "produto_final").length}{" "}
              produtos finais
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-red-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Estoque Baixo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {lowStockProducts}
            </div>
            <p className="text-xs text-red-600 mt-1">
              Produtos precisam reposição
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-restaurant-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Valor Total do Estoque
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-900">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-restaurant-600 mt-1">
              Investimento em estoque
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass border-restaurant-200/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-restaurant-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="ingrediente">Ingredientes</SelectItem>
                  <SelectItem value="produto_final">Produtos Finais</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estoque">Menor Estoque</SelectItem>
                  <SelectItem value="nome">Nome A-Z</SelectItem>
                  <SelectItem value="preco">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="glass border-restaurant-200/50">
        <CardHeader>
          <CardTitle className="text-restaurant-900">
            Lista de Produtos ({filteredAndSortedProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedProducts.map((produto) => {
                const stockStatus = getStockStatus(produto);
                const totalValue = produto.estoque * produto.preco_unitario;

                return (
                  <TableRow
                    key={produto.id}
                    className="hover:bg-restaurant-50/50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-restaurant-900">
                          {produto.nome}
                        </div>
                        {produto.descricao && (
                          <div className="text-sm text-restaurant-600">
                            {produto.descricao}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-restaurant-700">
                        {produto.categoria || "Sem categoria"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {produto.estoque} {produto.unidade}
                        </span>
                        {produto.estoque <= produto.alerta_minimo && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-restaurant-600">
                        Min: {produto.alerta_minimo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color}>
                        {stockStatus.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(produto.preco_unitario)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(totalValue)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          produto.tipo === "produto_final"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {produto.tipo === "produto_final"
                          ? "Produto Final"
                          : "Ingrediente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Editar Produto</DialogTitle>
                            </DialogHeader>
                            <ProductForm produto={produto} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
