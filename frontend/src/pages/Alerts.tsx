import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  AlertTriangle,
  MessageSquare,
  Bell,
  ShoppingCart,
  Package,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { mockAlertasEstoque, mockProdutos } from "@/lib/mock-data";
import { AlertaEstoque } from "@/lib/types";

export default function Alerts() {
  const [alertas] = useState<AlertaEstoque[]>(mockAlertasEstoque);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("(11) 99999-9999");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const generateShoppingList = () => {
    return alertas
      .map((alerta) => {
        const produto = alerta.produto;
        return `• ${produto.nome}: ${alerta.sugestao_compra} ${produto.unidade} (atual: ${alerta.estoque_atual})`;
      })
      .join("\n");
  };

  const generateWhatsAppMessage = () => {
    const message = `🛒 *LISTA DE COMPRAS URGENTE*

Produtos com estoque baixo que precisam de reposição:

${generateShoppingList()}

📊 *Resumo:*
• ${alertas.length} produto(s) com estoque baixo
• Valor estimado: ${formatCurrency(
      alertas.reduce(
        (sum, alerta) =>
          sum + alerta.sugestao_compra * alerta.produto.preco_unitario,
        0,
      ),
    )}

⚠️ Reabasteça o quanto antes para evitar rupturas de estoque!

_Mensagem automática do Sistema de Gestão_`;

    return encodeURIComponent(message);
  };

  const sendWhatsAppAlert = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const totalValue = alertas.reduce(
    (sum, alerta) =>
      sum + alerta.sugestao_compra * alerta.produto.preco_unitario,
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-900">
            Alertas de Estoque
          </h1>
          <p className="text-restaurant-600 mt-1">
            Monitore produtos com estoque baixo e envie alertas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant={alertas.length > 0 ? "destructive" : "outline"}
            className={
              alertas.length > 0 ? "" : "border-success-200 text-success-700"
            }
          >
            {alertas.length > 0
              ? `${alertas.length} Alertas Ativos`
              : "Estoque OK"}
          </Badge>
          {alertas.length > 0 && (
            <Button
              onClick={sendWhatsAppAlert}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar WhatsApp
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-red-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Produtos em Alerta
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {alertas.length}
            </div>
            <p className="text-xs text-red-600 mt-1">
              de {mockProdutos.length} produtos totais
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-restaurant-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Valor para Reposição
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-900">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-restaurant-600 mt-1">
              Estimativa de compra
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-restaurant-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-restaurant-700">
              Status WhatsApp
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-restaurant-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {whatsappEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {whatsappEnabled ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <p className="text-xs text-restaurant-600 mt-1">Integração ativa</p>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Configuration */}
      <Card className="glass border-restaurant-200/50">
        <CardHeader>
          <CardTitle className="text-restaurant-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Configurações do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-enabled">
                    Habilitar Notificações
                  </Label>
                  <p className="text-sm text-restaurant-600">
                    Receber alertas por WhatsApp
                  </p>
                </div>
                <Switch
                  id="whatsapp-enabled"
                  checked={whatsappEnabled}
                  onCheckedChange={setWhatsappEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-send">Envio Automático</Label>
                  <p className="text-sm text-restaurant-600">
                    Enviar alertas automaticamente
                  </p>
                </div>
                <Switch
                  id="auto-send"
                  checked={autoSendEnabled}
                  onCheckedChange={setAutoSendEnabled}
                  disabled={!whatsappEnabled}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Número do WhatsApp</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(11) 99999-9999"
                  disabled={!whatsappEnabled}
                />
              </div>

              <Button
                onClick={sendWhatsAppAlert}
                disabled={!whatsappEnabled || alertas.length === 0}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Testar Envio de Alerta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      {alertas.length > 0 ? (
        <Card className="glass border-restaurant-200/50">
          <CardHeader>
            <CardTitle className="text-restaurant-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Produtos com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Sugestão de Compra</TableHead>
                  <TableHead>Valor Estimado</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertas.map((alerta) => {
                  const produto = alerta.produto;
                  const valorEstimado =
                    alerta.sugestao_compra * produto.preco_unitario;
                  const urgencia =
                    alerta.estoque_atual === 0
                      ? "crítico"
                      : alerta.estoque_atual <= alerta.estoque_minimo * 0.5
                        ? "urgente"
                        : "baixo";

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
                        <Badge
                          variant="outline"
                          className="text-restaurant-700"
                        >
                          {produto.categoria || "Sem categoria"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-medium ${
                              alerta.estoque_atual === 0
                                ? "text-red-600"
                                : alerta.estoque_atual <=
                                    alerta.estoque_minimo * 0.5
                                  ? "text-orange-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {alerta.estoque_atual} {produto.unidade}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {alerta.estoque_minimo} {produto.unidade}
                      </TableCell>
                      <TableCell className="font-medium">
                        {alerta.sugestao_compra} {produto.unidade}
                      </TableCell>
                      <TableCell>{formatCurrency(valorEstimado)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            urgencia === "crítico"
                              ? "bg-red-100 text-red-800"
                              : urgencia === "urgente"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {urgencia === "crítico"
                            ? "Crítico"
                            : urgencia === "urgente"
                              ? "Urgente"
                              : "Baixo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass border-success-200/50">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-success-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-success-900 mb-2">
              Estoque em Dia!
            </h3>
            <p className="text-success-700 mb-4">
              Todos os produtos estão com estoque adequado.
            </p>
            <Badge className="bg-success-100 text-success-800">
              Nenhum alerta ativo
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Shopping List Preview */}
      {alertas.length > 0 && (
        <Card className="glass border-restaurant-200/50">
          <CardHeader>
            <CardTitle className="text-restaurant-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Lista de Compras Gerada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-restaurant-50 p-4 rounded-lg">
              <pre className="text-sm text-restaurant-800 whitespace-pre-wrap font-mono">
                {`🛒 LISTA DE COMPRAS URGENTE

Produtos com estoque baixo:

${generateShoppingList()}

📊 Resumo:
• ${alertas.length} produto(s) com estoque baixo
• Valor estimado: ${formatCurrency(totalValue)}

⚠️ Reabasteça o quanto antes!`}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={sendWhatsAppAlert}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Lista por WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
