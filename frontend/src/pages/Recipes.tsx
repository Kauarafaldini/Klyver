import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Edit,
  Trash2,
  ChefHat,
  DollarSign,
  Clock,
  Minus,
  Calculator,
} from "lucide-react";
import { mockReceitas, mockProdutos } from "@/lib/mock-data";
import { Receita, Produto, ReceitaIngrediente } from "@/lib/types";

interface RecipeIngredient {
  produto_id: string;
  quantidade: number;
  produto?: Produto;
}

export default function Recipes() {
  const [receitas, setReceitas] = useState<Receita[]>(mockReceitas);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceita, setSelectedReceita] = useState<Receita | null>(null);

  // Filtrar apenas ingredientes do estoque
  const ingredientesDisponiveis = mockProdutos.filter(
    (produto) => produto.tipo === "ingrediente",
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calcularCustoReceita = (ingredientes: ReceitaIngrediente[]) => {
    return ingredientes.reduce((total, ingrediente) => {
      const produto = mockProdutos.find((p) => p.id === ingrediente.produto_id);
      return total + (produto?.preco_unitario || 0) * ingrediente.quantidade;
    }, 0);
  };

  const calcularMargemLucro = (receita: Receita) => {
    const custo = calcularCustoReceita(receita.ingredientes);
    const margem =
      ((receita.preco_sugerido - custo) / receita.preco_sugerido) * 100;
    return { custo, margem };
  };

  const RecipeForm = ({ receita }: { receita?: Receita }) => {
    const [formData, setFormData] = useState({
      nome: receita?.nome || "",
      descricao: receita?.descricao || "",
      preco_sugerido: receita?.preco_sugerido || 0,
      tempo_preparo: receita?.tempo_preparo || 10,
      ingredientes: receita?.ingredientes || [],
    });

    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [quantidade, setQuantidade] = useState(1);

    const adicionarIngrediente = () => {
      if (!selectedIngredient) return;

      const produto = ingredientesDisponiveis.find(
        (p) => p.id === selectedIngredient,
      );
      if (!produto) return;

      const novoIngrediente: ReceitaIngrediente = {
        id: `ri_${Date.now()}`,
        receita_id: receita?.id || "",
        produto_id: selectedIngredient,
        quantidade,
        cliente_id: "cliente_001",
        produto,
      };

      setFormData({
        ...formData,
        ingredientes: [...formData.ingredientes, novoIngrediente],
      });

      setSelectedIngredient("");
      setQuantidade(1);
    };

    const removerIngrediente = (index: number) => {
      const novosIngredientes = formData.ingredientes.filter(
        (_, i) => i !== index,
      );
      setFormData({ ...formData, ingredientes: novosIngredientes });
    };

    const custoTotal = calcularCustoReceita(formData.ingredientes);
    const margemLucro =
      formData.preco_sugerido > 0
        ? ((formData.preco_sugerido - custoTotal) / formData.preco_sugerido) *
          100
        : 0;

    return (
      <form className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações da Receita</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Receita</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: X-Burger Clássico"
              />
            </div>
            <div>
              <Label htmlFor="tempo_preparo">Tempo de Preparo (min)</Label>
              <Input
                id="tempo_preparo"
                type="number"
                value={formData.tempo_preparo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tempo_preparo: parseInt(e.target.value),
                  })
                }
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descreva os ingredientes e modo de preparo..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="preco_sugerido">Preço de Venda</Label>
            <Input
              id="preco_sugerido"
              type="number"
              step="0.01"
              value={formData.preco_sugerido}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preco_sugerido: parseFloat(e.target.value),
                })
              }
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Adicionar Ingredientes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ingredientes</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Ingrediente</Label>
              <Select
                value={selectedIngredient}
                onValueChange={setSelectedIngredient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ingrediente" />
                </SelectTrigger>
                <SelectContent>
                  {ingredientesDisponiveis.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} - {formatCurrency(produto.preco_unitario)}/
                      {produto.unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <Button
              type="button"
              onClick={adicionarIngrediente}
              disabled={!selectedIngredient}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Lista de Ingredientes */}
          {formData.ingredientes.length > 0 && (
            <div className="border rounded-lg p-4">
              <div className="space-y-2">
                {formData.ingredientes.map((ingrediente, index) => {
                  const produto = ingredientesDisponiveis.find(
                    (p) => p.id === ingrediente.produto_id,
                  );
                  const custoItem =
                    (produto?.preco_unitario || 0) * ingrediente.quantidade;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{produto?.nome}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {ingrediente.quantidade} {produto?.unidade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatCurrency(custoItem)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerIngrediente(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Resumo Financeiro */}
        {formData.ingredientes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Análise Financeira</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(custoTotal)}
                    </div>
                    <div className="text-sm text-gray-600">Custo Total</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(formData.preco_sugerido)}
                    </div>
                    <div className="text-sm text-gray-600">Preço de Venda</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${
                        margemLucro > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {margemLucro.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Margem de Lucro</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button>{receita ? "Atualizar" : "Criar"} Receita</Button>
        </div>
      </form>
    );
  };

  const filteredReceitas = receitas.filter((receita) =>
    receita.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Receitas e Produtos Compostos
          </h1>
          <p className="text-muted-foreground mt-1">
            Crie produtos compostos usando ingredientes do seu estoque
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Receita</DialogTitle>
            </DialogHeader>
            <RecipeForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receitas
            </CardTitle>
            <ChefHat className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receitas.length}</div>
            <p className="text-xs text-muted-foreground">
              receitas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                receitas.reduce((sum, r) => sum + r.preco_sugerido, 0) /
                  receitas.length || 0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">valor médio</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                receitas.reduce((sum, r) => sum + (r.tempo_preparo || 0), 0) /
                  receitas.length || 0,
              )}{" "}
              min
            </div>
            <p className="text-xs text-muted-foreground">preparo médio</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(
                receitas.reduce(
                  (sum, r) => sum + calcularMargemLucro(r).margem,
                  0,
                ) / receitas.length || 0
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">lucro médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-primary/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar receitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipes Table */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle>
            Receitas Cadastradas ({filteredReceitas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receita</TableHead>
                <TableHead>Preço de Venda</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Ingredientes</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceitas.map((receita) => {
                const { custo, margem } = calcularMargemLucro(receita);

                return (
                  <TableRow key={receita.id} className="hover:bg-primary/5">
                    <TableCell>
                      <div>
                        <div className="font-medium">{receita.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {receita.descricao}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(receita.preco_sugerido)}
                    </TableCell>
                    <TableCell>{formatCurrency(custo)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          margem > 50
                            ? "bg-green-100 text-green-800"
                            : margem > 20
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {margem.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{receita.tempo_preparo || 0} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {receita.ingredientes.length} ingredientes
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
                              onClick={() => setSelectedReceita(receita)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Receita</DialogTitle>
                            </DialogHeader>
                            <RecipeForm receita={receita} />
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
