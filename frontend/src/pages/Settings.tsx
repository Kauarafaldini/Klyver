import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Palette,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  Crown,
  Shield,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Zap,
} from "lucide-react";
import {
  mockCliente,
  mockUsuarios,
  mockConfiguracoesSistema,
  mockHistoricoPagamentos,
  mockPlanos,
} from "@/lib/mock-data";
import {
  Cliente,
  Usuario,
  ConfiguracoesSistema,
  HistoricoPagamento,
} from "@/lib/types";

const Settings = () => {
  const [cliente, setCliente] = useState<Cliente>(mockCliente);
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSistema>(
    mockConfiguracoesSistema,
  );
  const [historicoPagamentos] = useState<HistoricoPagamento[]>(
    mockHistoricoPagamentos,
  );

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [newUser, setNewUser] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "funcionario" as "admin" | "funcionario",
  });

  const handleSaveEmpresa = () => {
    toast.success("Dados da empresa salvos com sucesso!");
  };

  const handleSavePreferencias = () => {
    toast.success("Preferências do sistema salvas!");
  };

  const handleAddUser = () => {
    if (!newUser.nome || !newUser.email || !newUser.senha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const novoUsuario: Usuario = {
      id: `user_${Date.now()}`,
      nome: newUser.nome,
      email: newUser.email,
      tipo: newUser.tipo,
      cliente_id: cliente.id,
      ativo: true,
      data_criacao: new Date(),
    };

    setUsuarios([...usuarios, novoUsuario]);
    setNewUser({ nome: "", email: "", senha: "", tipo: "funcionario" });
    setIsAddUserOpen(false);
    toast.success("Usuário criado com sucesso!");
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsuarios(
      usuarios.map((u) => (u.id === selectedUser.id ? selectedUser : u)),
    );
    setIsEditUserOpen(false);
    setSelectedUser(null);
    toast.success("Usuário atualizado com sucesso!");
  };

  const handleDeleteUser = (userId: string) => {
    setUsuarios(usuarios.filter((u) => u.id !== userId));
    toast.success("Usuário removido com sucesso!");
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsuarios(
      usuarios.map((u) => (u.id === userId ? { ...u, ativo: !u.ativo } : u)),
    );
    toast.success("Status do usuário atualizado!");
  };

  const planoAtual = mockPlanos.find((p) => p.valor === cliente.valor_plano);
  const modulosAtivos = Object.entries(cliente.modulos_ativos).filter(
    ([_, ativo]) => ativo,
  );
  const proximoVencimento = new Date();
  proximoVencimento.setDate(cliente.dia_vencimento);
  if (proximoVencimento < new Date()) {
    proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pago: "default",
      pendente: "secondary",
      vencido: "destructive",
    } as const;

    const labels = {
      pago: "Pago",
      pendente: "Pendente",
      vencido: "Vencido",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-900">
            Configurações
          </h1>
          <p className="text-restaurant-600 mt-1">
            Gerencie as configurações do sistema para {cliente.nome_fantasia}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-restaurant-600" />
          <Badge className="bg-restaurant-100 text-restaurant-800 border-restaurant-200">
            {planoAtual?.nome || "Padrão"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="empresa" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="plano" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plano
          </TabsTrigger>
        </TabsList>

        {/* Dados da Empresa */}
        <TabsContent value="empresa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Dados básicos da sua empresa exibidos no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_fantasia">Nome Fantasia *</Label>
                  <Input
                    id="nome_fantasia"
                    value={cliente.nome_fantasia}
                    onChange={(e) =>
                      setCliente({ ...cliente, nome_fantasia: e.target.value })
                    }
                    placeholder="Nome da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={cliente.cnpj}
                    onChange={(e) =>
                      setCliente({ ...cliente, cnpj: e.target.value })
                    }
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cliente.email}
                    onChange={(e) =>
                      setCliente({ ...cliente, email: e.target.value })
                    }
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={cliente.telefone}
                    onChange={(e) =>
                      setCliente({ ...cliente, telefone: e.target.value })
                    }
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Textarea
                  id="endereco"
                  value={cliente.endereco}
                  onChange={(e) =>
                    setCliente({ ...cliente, endereco: e.target.value })
                  }
                  rows={3}
                  placeholder="Rua, número, bairro, cidade - estado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_empresa">Tipo de Negócio</Label>
                <Select
                  value={cliente.tipo_empresa}
                  onValueChange={(value) =>
                    setCliente({ ...cliente, tipo_empresa: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de negócio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lanchonete">Lanchonete</SelectItem>
                    <SelectItem value="Restaurante">Restaurante</SelectItem>
                    <SelectItem value="Pizzaria">Pizzaria</SelectItem>
                    <SelectItem value="Padaria">Padaria</SelectItem>
                    <SelectItem value="Confeitaria">Confeitaria</SelectItem>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="Food Truck">Food Truck</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveEmpresa} className="w-full">
                Salvar Dados da Empresa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestão de Usuários */}
        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestão de Usuários
                  </CardTitle>
                  <CardDescription>
                    Gerencie usuários com acesso ao sistema
                  </CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Adicione um novo usuário ao sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new_nome">Nome Completo</Label>
                        <Input
                          id="new_nome"
                          value={newUser.nome}
                          onChange={(e) =>
                            setNewUser({ ...newUser, nome: e.target.value })
                          }
                          placeholder="Nome do usuário"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_email">E-mail</Label>
                        <Input
                          id="new_email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="usuario@empresa.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_senha">Senha</Label>
                        <Input
                          id="new_senha"
                          type="password"
                          value={newUser.senha}
                          onChange={(e) =>
                            setNewUser({ ...newUser, senha: e.target.value })
                          }
                          placeholder="Senha do usuário"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_tipo">Tipo de Usuário</Label>
                        <Select
                          value={newUser.tipo}
                          onValueChange={(value: "admin" | "funcionario") =>
                            setNewUser({ ...newUser, tipo: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="funcionario">
                              Funcionário
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddUserOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUser}>Criar Usuário</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-restaurant-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-restaurant-600" />
                          </div>
                          <div>
                            <p className="font-medium">{usuario.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {usuario.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            usuario.tipo === "admin" ? "default" : "secondary"
                          }
                        >
                          {usuario.tipo === "admin" ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {usuario.tipo === "admin" ? "Admin" : "Funcionário"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={usuario.ativo ? "default" : "secondary"}
                        >
                          {usuario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {usuario.ultimo_acesso
                          ? usuario.ultimo_acesso.toLocaleDateString()
                          : "Nunca"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(usuario);
                              setIsEditUserOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleUserStatus(usuario.id)}
                          >
                            {usuario.ativo ? (
                              <X className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(usuario.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Dialog para editar usuário */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogDescription>
                  Altere as informações do usuário
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_nome">Nome Completo</Label>
                    <Input
                      id="edit_nome"
                      value={selectedUser.nome}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_email">E-mail</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_tipo">Tipo de Usuário</Label>
                    <Select
                      value={selectedUser.tipo}
                      onValueChange={(value: "admin" | "funcionario") =>
                        setSelectedUser({ ...selectedUser, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="funcionario">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditUserOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleEditUser}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Preferências do Sistema */}
        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferências do Sistema
              </CardTitle>
              <CardDescription>
                Configure o comportamento padrão do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select
                    value={configuracoes.idioma}
                    onValueChange={(value) =>
                      setConfiguracoes({ ...configuracoes, idioma: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidade_padrao">Unidade Padrão</Label>
                  <Select
                    value={configuracoes.unidade_padrao}
                    onValueChange={(value) =>
                      setConfiguracoes({
                        ...configuracoes,
                        unidade_padrao: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unid">Unidade</SelectItem>
                      <SelectItem value="kg">Quilograma</SelectItem>
                      <SelectItem value="g">Grama</SelectItem>
                      <SelectItem value="l">Litro</SelectItem>
                      <SelectItem value="ml">Mililitro</SelectItem>
                      <SelectItem value="cx">Caixa</SelectItem>
                      <SelectItem value="pc">Peça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_alerta_estoque">
                  Valor Padrão de Alerta de Estoque
                </Label>
                <Input
                  id="valor_alerta_estoque"
                  type="number"
                  value={configuracoes.valor_alerta_estoque}
                  onChange={(e) =>
                    setConfiguracoes({
                      ...configuracoes,
                      valor_alerta_estoque: Number(e.target.value),
                    })
                  }
                  placeholder="10"
                />
                <p className="text-sm text-muted-foreground">
                  Quantidade mínima que será aplicada por padrão aos novos
                  produtos
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Notificações</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Notificações por E-mail
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas e relatórios por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoes_email}
                    onCheckedChange={(checked) =>
                      setConfiguracoes({
                        ...configuracoes,
                        notificacoes_email: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Backup Automático
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Criar backup dos dados automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={configuracoes.backup_automatico}
                    onCheckedChange={(checked) =>
                      setConfiguracoes({
                        ...configuracoes,
                        backup_automatico: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferencias} className="w-full">
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plano e Módulos */}
        <TabsContent value="plano" className="space-y-6">
          {/* Informações do Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Plano Atual
              </CardTitle>
              <CardDescription>
                Detalhes da sua assinatura e módulos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-restaurant-50 rounded-lg border border-restaurant-200">
                <div>
                  <h3 className="text-lg font-semibold text-restaurant-900">
                    {planoAtual?.nome || "Plano Personalizado"}
                  </h3>
                  <p className="text-restaurant-600">
                    {planoAtual?.descricao ||
                      "Plano customizado para suas necessidades"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-restaurant-900">
                    {formatCurrency(cliente.valor_plano)}
                  </p>
                  <p className="text-sm text-restaurant-600">por mês</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Próximo Vencimento</p>
                    <p className="font-medium">
                      {proximoVencimento.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Status</p>
                    <p className="font-medium">Ativo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Módulos</p>
                    <p className="font-medium">{modulosAtivos.length} ativos</p>
                  </div>
                </div>
              </div>

              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  Sua próxima cobrança será processada em{" "}
                  {Math.ceil(
                    (proximoVencimento.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  dias. O valor será debitado automaticamente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Módulos Ativos */}
          <Card>
            <CardHeader>
              <CardTitle>Módulos do Sistema</CardTitle>
              <CardDescription>
                Funcionalidades incluídas no seu plano atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(cliente.modulos_ativos).map(
                  ([modulo, ativo]) => (
                    <div
                      key={modulo}
                      className={`p-4 rounded-lg border ${
                        ativo
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium capitalize">
                            {modulo.replace("_", " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {getModuleDescription(modulo)}
                          </p>
                        </div>
                        {ativo ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Planos Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Planos Disponíveis</CardTitle>
              <CardDescription>
                Conheça todos os planos e faça upgrade quando necessário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockPlanos.map((plano) => (
                  <div
                    key={plano.id}
                    className={`p-4 rounded-lg border ${
                      plano.valor === cliente.valor_plano
                        ? "bg-restaurant-50 border-restaurant-300 ring-2 ring-restaurant-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">{plano.nome}</h3>
                      <p className="text-2xl font-bold">
                        {formatCurrency(plano.valor)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {plano.descricao}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plano.modulos.length} módulos inclusos
                      </p>
                      {plano.valor === cliente.valor_plano ? (
                        <Badge className="w-full justify-center">
                          Plano Atual
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full">
                          {plano.valor > cliente.valor_plano
                            ? "Upgrade"
                            : "Downgrade"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button className="flex items-center gap-2 mx-auto">
                  <Crown className="h-4 w-4" />
                  Solicitar Upgrade/Mudança de Plano
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Entre em contato para personalizar seu plano
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Últimas faturas e pagamentos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Fatura</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoPagamentos.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell>
                        {pagamento.data_pagamento.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {pagamento.numero_fatura}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(pagamento.valor)}
                      </TableCell>
                      <TableCell>{pagamento.metodo_pagamento}</TableCell>
                      <TableCell>{getStatusBadge(pagamento.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get module descriptions
const getModuleDescription = (modulo: string): string => {
  const descriptions: Record<string, string> = {
    vendas: "Sistema de vendas e PDV",
    produtos: "Gestão de estoque",
    receitas: "Receitas e produtos compostos",
    compras: "Controle de compras",
    financeiro: "Relatórios financeiros",
    alertas: "Alertas de estoque",
    whatsapp: "Integração WhatsApp",
    configuracoes: "Configurações do sistema",
  };
  return descriptions[modulo] || "Módulo do sistema";
};

export default Settings;
