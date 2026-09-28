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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  DollarSign,
  Calendar,
  Building,
} from "lucide-react";
import {
  mockClientes,
  tiposEmpresa,
  planosDisponiveis,
} from "@/lib/admin-mock-data";
import { Cliente, ModulosAtivos } from "@/lib/types";
import { Link } from "react-router-dom";

export default function ClientManagement() {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  };

  const toggleClientStatus = (clienteId: string) => {
    setClientes(
      clientes.map((cliente) =>
        cliente.id === clienteId
          ? { ...cliente, ativo: !cliente.ativo }
          : cliente,
      ),
    );
  };

  const filteredClients = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpj.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "ativo" && cliente.ativo) ||
      (filterStatus === "inativo" && !cliente.ativo);
    const matchesTipo =
      filterTipo === "all" || cliente.tipo_empresa === filterTipo;

    return matchesSearch && matchesStatus && matchesTipo;
  });

  const ClientForm = ({ cliente }: { cliente?: Cliente }) => {
    const [formData, setFormData] = useState({
      nome_fantasia: cliente?.nome_fantasia || "",
      cnpj: cliente?.cnpj || "",
      email: cliente?.email || "",
      telefone: cliente?.telefone || "",
      endereco: cliente?.endereco || "",
      tipo_empresa: cliente?.tipo_empresa || "",
      valor_plano: cliente?.valor_plano || 89.9,
      dia_vencimento: cliente?.dia_vencimento || 10,
      modulos_ativos: cliente?.modulos_ativos || {
        vendas: true,
        produtos: true,
        receitas: true,
        compras: true,
        financeiro: true,
        alertas: true,
        whatsapp: false,
      },
    });

    const handleModuleToggle = (module: keyof ModulosAtivos) => {
      setFormData({
        ...formData,
        modulos_ativos: {
          ...formData.modulos_ativos,
          [module]: !formData.modulos_ativos[module],
        },
      });
    };

    return (
      <form className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_fantasia">Nome da Empresa</Label>
              <Input
                id="nome_fantasia"
                value={formData.nome_fantasia}
                onChange={(e) =>
                  setFormData({ ...formData, nome_fantasia: e.target.value })
                }
                placeholder="Ex: Lanchonete do João"
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: e.target.value })
                }
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                placeholder="Rua, número, bairro, cidade - UF"
              />
            </div>
            <div>
              <Label htmlFor="tipo_empresa">Tipo de Empresa</Label>
              <Select
                value={formData.tipo_empresa}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo_empresa: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposEmpresa.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Plano e Cobrança</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_plano">Valor do Plano Mensal</Label>
              <Select
                value={formData.valor_plano.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, valor_plano: parseFloat(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planosDisponiveis.map((plano) => (
                    <SelectItem
                      key={plano.valor}
                      value={plano.valor.toString()}
                    >
                      {plano.nome} - {formatCurrency(plano.valor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dia_vencimento">Dia do Vencimento</Label>
              <Select
                value={formData.dia_vencimento.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, dia_vencimento: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                    <SelectItem key={dia} value={dia.toString()}>
                      Dia {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Módulos Ativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.modulos_ativos).map(([module, active]) => (
              <div
                key={module}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <Label htmlFor={module} className="font-medium capitalize">
                    {module}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {module === "vendas" && "Sistema de vendas e PDV"}
                    {module === "produtos" && "Gestão de estoque"}
                    {module === "receitas" && "Cardápio e receitas"}
                    {module === "compras" && "Controle de compras"}
                    {module === "financeiro" && "Relatórios financeiros"}
                    {module === "alertas" && "Alertas de estoque"}
                    {module === "whatsapp" && "Integração WhatsApp"}
                  </p>
                </div>
                <Switch
                  id={module}
                  checked={active}
                  onCheckedChange={() =>
                    handleModuleToggle(module as keyof ModulosAtivos)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-gradient-to-r from-primary to-accent">
            {cliente ? "Atualizar" : "Cadastrar"} Cliente
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Administre todos os clientes da plataforma
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
            <p className="text-xs text-muted-foreground">
              clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-success-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Eye className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-700">
              {clientes.filter((c) => c.ativo).length}
            </div>
            <p className="text-xs text-muted-foreground">clientes ativos</p>
          </CardContent>
        </Card>

        <Card className="glass border-destructive-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <EyeOff className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {clientes.filter((c) => !c.ativo).length}
            </div>
            <p className="text-xs text-muted-foreground">clientes inativos</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RMR</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(
                clientes
                  .filter((c) => c.ativo)
                  .reduce((sum, c) => sum + c.valor_plano, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">receita mensal</p>
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
                  placeholder="Buscar por nome, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos tipos</SelectItem>
                  {tiposEmpresa.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((cliente) => {
                const modulosAtivos = Object.values(
                  cliente.modulos_ativos,
                ).filter(Boolean).length;
                const totalModulos = Object.keys(cliente.modulos_ativos).length;

                return (
                  <TableRow key={cliente.id} className="hover:bg-primary/5">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {cliente.nome_fantasia}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCNPJ(cliente.cnpj)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cliente.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cliente.tipo_empresa}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(cliente.valor_plano)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        mensal
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={cliente.ativo}
                          onCheckedChange={() => toggleClientStatus(cliente.id)}
                        />
                        <Badge
                          variant={cliente.ativo ? "default" : "secondary"}
                          className={
                            cliente.ativo
                              ? "bg-success-500 hover:bg-success-600"
                              : "bg-muted"
                          }
                        >
                          {cliente.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Dia {cliente.dia_vencimento}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Settings className="w-3 h-3" />
                        <span className="text-sm">
                          {modulosAtivos}/{totalModulos}
                        </span>
                      </div>
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
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Cliente</DialogTitle>
                            </DialogHeader>
                            <ClientForm cliente={cliente} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
