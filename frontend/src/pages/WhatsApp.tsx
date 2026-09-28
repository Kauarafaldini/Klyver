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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  MessageCircle,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Bot,
  History,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  mockWhatsAppConfig,
  mockLogsMensagens,
  mockCliente,
  mockAlertasEstoque,
} from "@/lib/mock-data";
import { WhatsAppConfig, LogMensagem } from "@/lib/types";

const WhatsApp = () => {
  const [config, setConfig] = useState<WhatsAppConfig>(mockWhatsAppConfig);
  const [logs] = useState<LogMensagem[]>(mockLogsMensagens);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testNumber, setTestNumber] = useState("");

  const handleSaveConfig = () => {
    // Simular salvamento da configuração
    toast.success("Configurações salvas com sucesso!");
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);

    // Simular teste de conexão
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.3; // 70% chance de sucesso

    if (isSuccess) {
      toast.success("Conexão testada com sucesso! ✅");
    } else {
      toast.error("Erro na conexão. Verifique suas credenciais.");
    }

    setIsTestingConnection(false);
  };

  const handleSendTestMessage = async () => {
    if (!testMessage.trim() || !testNumber.trim()) {
      toast.error("Preencha o número e a mensagem de teste");
      return;
    }

    setIsTestingConnection(true);

    // Simular envio de mensagem
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.2; // 80% chance de sucesso

    if (isSuccess) {
      toast.success("Mensagem de teste enviada com sucesso! 📱");
      setTestMessage("");
      setTestNumber("");
    } else {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }

    setIsTestingConnection(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enviado":
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case "erro":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pendente":
        return <Clock className="h-4 w-4 text-warning-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      enviado: "default",
      erro: "destructive",
      pendente: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\+\d{2})(\d{2})(\d{4,5})(\d{4})/, "$1 ($2) $3-$4");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-900">
            Integração WhatsApp
          </h1>
          <p className="text-restaurant-600 mt-1">
            Configure o envio automático de mensagens para{" "}
            {mockCliente.nome_fantasia}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-success-600" />
          {config.ativo && (
            <Badge className="bg-success-100 text-success-800 border-success-200">
              Conectado
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Teste
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        {/* Configuração */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Dados de Conexão
              </CardTitle>
              <CardDescription>
                Configure sua API do WhatsApp para envio de mensagens
                automáticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número do WhatsApp</Label>
                  <Input
                    id="numero"
                    value={config.numero_whatsapp}
                    onChange={(e) =>
                      setConfig({ ...config, numero_whatsapp: e.target.value })
                    }
                    placeholder="+5511999999999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instance">ID da Instância</Label>
                  <Input
                    id="instance"
                    value={config.instance_id || ""}
                    onChange={(e) =>
                      setConfig({ ...config, instance_id: e.target.value })
                    }
                    placeholder="A20DA9C0183A2D35..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_url">URL da API</Label>
                <Input
                  id="api_url"
                  value={config.api_url}
                  onChange={(e) =>
                    setConfig({ ...config, api_url: e.target.value })
                  }
                  placeholder="https://api.z-api.io"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token da API</Label>
                <Input
                  id="token"
                  type="password"
                  value={config.api_token}
                  onChange={(e) =>
                    setConfig({ ...config, api_token: e.target.value })
                  }
                  placeholder="EAAZBob..."
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Suportamos: Z-API, UltraMsg, WATI e WhatsApp Business API.
                  Mantenha suas credenciais seguras e nunca as compartilhe.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveConfig}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Salvar Configurações
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="flex items-center gap-2"
                >
                  {isTestingConnection ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isTestingConnection ? "Testando..." : "Testar Conexão"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mensagens Automáticas */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid gap-6">
            {/* Configurações de Ativação */}
            <Card>
              <CardHeader>
                <CardTitle>Mensagens Automáticas</CardTitle>
                <CardDescription>
                  Configure quais mensagens serão enviadas automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Alerta de Estoque Baixo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar quando produtos atingirem o estoque mínimo
                    </p>
                  </div>
                  <Switch
                    checked={config.mensagens_ativas.estoque_baixo}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        mensagens_ativas: {
                          ...config.mensagens_ativas,
                          estoque_baixo: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Lista de Compras Semanal
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar lista de compras toda segunda-feira
                    </p>
                  </div>
                  <Switch
                    checked={config.mensagens_ativas.lista_compras}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        mensagens_ativas: {
                          ...config.mensagens_ativas,
                          lista_compras: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Lembrete de Pagamento
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lembrar sobre vencimento do plano (3 dias antes)
                    </p>
                  </div>
                  <Switch
                    checked={config.mensagens_ativas.lembrete_pagamento}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        mensagens_ativas: {
                          ...config.mensagens_ativas,
                          lembrete_pagamento: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Templates de Mensagem */}
            <Card>
              <CardHeader>
                <CardTitle>Templates de Mensagem</CardTitle>
                <CardDescription>
                  Personalize o conteúdo das mensagens automáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="template_estoque">
                    Alerta de Estoque Baixo
                  </Label>
                  <Textarea
                    id="template_estoque"
                    value={config.templates_mensagem.estoque_baixo}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        templates_mensagem: {
                          ...config.templates_mensagem,
                          estoque_baixo: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    placeholder="Digite o template da mensagem..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {"{{produto}}"}, {"{{quantidade}}"},{" "}
                    {"{{unidade}}"}, {"{{minimo}}"}, {"{{sugestao}}"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_compras">Lista de Compras</Label>
                  <Textarea
                    id="template_compras"
                    value={config.templates_mensagem.lista_compras}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        templates_mensagem: {
                          ...config.templates_mensagem,
                          lista_compras: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    placeholder="Digite o template da mensagem..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {"{{lista}}"}, {"{{total}}"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_pagamento">
                    Lembrete de Pagamento
                  </Label>
                  <Textarea
                    id="template_pagamento"
                    value={config.templates_mensagem.lembrete_pagamento}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        templates_mensagem: {
                          ...config.templates_mensagem,
                          lembrete_pagamento: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    placeholder="Digite o template da mensagem..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {"{{dias}}"}, {"{{valor}}"},{" "}
                    {"{{data}}"}
                  </p>
                </div>

                <Button onClick={handleSaveConfig} className="w-full">
                  Salvar Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teste de Envio */}
        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar Mensagem de Teste
              </CardTitle>
              <CardDescription>
                Teste a conexão enviando uma mensagem manual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test_number">Número de Destino</Label>
                  <Input
                    id="test_number"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="+5511999999999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status da Conexão</Label>
                  <div className="flex items-center gap-2 pt-2">
                    {config.ativo ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success-600" />
                        <span className="text-sm text-success-600">
                          Conectado
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">
                          Desconectado
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test_message">Mensagem de Teste</Label>
                <Textarea
                  id="test_message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                  placeholder="Digite sua mensagem de teste..."
                />
              </div>

              <Button
                onClick={handleSendTestMessage}
                disabled={
                  isTestingConnection ||
                  !testMessage.trim() ||
                  !testNumber.trim()
                }
                className="w-full flex items-center gap-2"
              >
                {isTestingConnection ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isTestingConnection
                  ? "Enviando..."
                  : "Enviar Mensagem de Teste"}
              </Button>

              {mockAlertasEstoque.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>
                      Você tem {mockAlertasEstoque.length} produtos com estoque
                      baixo!
                    </strong>
                    <br />
                    Ative os alertas automáticos para receber notificações no
                    WhatsApp.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Preview de Mensagens */}
          <Card>
            <CardHeader>
              <CardTitle>Preview das Mensagens Automáticas</CardTitle>
              <CardDescription>
                Veja como suas mensagens aparecerão no WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">
                  Alerta de Estoque Baixo
                </h4>
                <div className="bg-white rounded p-3 text-sm">
                  🚨 <strong>Alerta de Estoque</strong>
                  <br />
                  <br />O produto <strong>Carne Bovina</strong> está com estoque
                  baixo.
                  <br />
                  <br />
                  Estoque atual: 15 kg
                  <br />
                  Estoque mínimo: 20 kg
                  <br />
                  <br />
                  Sugestão de compra: 30 kg
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Lembrete de Pagamento
                </h4>
                <div className="bg-white rounded p-3 text-sm">
                  💰 <strong>Lembrete de Pagamento</strong>
                  <br />
                  <br />
                  Seu plano vence em 3 dias.
                  <br />
                  <br />
                  Valor: R$ 89,90
                  <br />
                  Vencimento: 10/02/2024
                  <br />
                  <br />
                  Mantenha seu sistema sempre ativo!
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Mensagens
              </CardTitle>
              <CardDescription>
                Últimas mensagens enviadas pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 border border-restaurant-200 rounded-lg hover:bg-restaurant-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(log.status)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatPhoneNumber(log.destinatario)}
                          </span>
                          {getStatusBadge(log.status)}
                          <Badge variant="outline" className="text-xs">
                            {log.tipo.replace("_", " ")}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {log.data_envio.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-restaurant-700 bg-restaurant-50 p-2 rounded border-l-4 border-restaurant-300">
                        {log.conteudo}
                      </p>
                      {log.resposta_api && (
                        <details className="text-xs">
                          <summary className="text-muted-foreground cursor-pointer hover:text-restaurant-700">
                            Ver resposta da API
                          </summary>
                          <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {log.resposta_api}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma mensagem enviada ainda</p>
                    <p className="text-sm">
                      As mensagens aparecerão aqui após o primeiro envio
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsApp;
