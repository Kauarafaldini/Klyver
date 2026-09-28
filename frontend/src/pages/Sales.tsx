import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Trash2,
  Receipt,
} from "lucide-react";
import { mockProdutos, mockReceitas } from "@/lib/mock-data";
import { Produto, Receita } from "@/lib/types";

interface CartItem {
  id: string;
  type: "produto" | "receita";
  item: Produto | Receita;
  quantity: number;
  unitPrice: number;
}

export default function Sales() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const addToCart = (item: Produto | Receita, type: "produto" | "receita") => {
    const unitPrice =
      type === "produto"
        ? (item as Produto).preco_unitario * 2.5 // Margem de lucro
        : (item as Receita).preco_sugerido;

    const existingItem = cart.find(
      (cartItem) => cartItem.item.id === item.id && cartItem.type === type,
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.item.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          id: `${type}_${item.id}`,
          type,
          item,
          quantity: 1,
          unitPrice,
        },
      ]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  const categories = Array.from(
    new Set(
      mockProdutos
        .filter((p) => p.tipo === "produto_final")
        .map((p) => p.categoria)
        .filter(Boolean),
    ),
  );

  const filteredProducts = mockProdutos
    .filter((produto) => produto.tipo === "produto_final")
    .filter((produto) => {
      const matchesCategory =
        selectedCategory === "all" || produto.categoria === selectedCategory;
      const matchesSearch = produto.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const finalizeSale = () => {
    if (cart.length === 0) return;

    // In a real app, this would process the sale
    alert(`Venda finalizada! Total: ${formatCurrency(cartTotal)}`);
    setCart([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-900">
            Ponto de Venda
          </h1>
          <p className="text-restaurant-600 mt-1">
            Sistema de vendas rápido e intuitivo
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className="border-success-200 text-success-700"
          >
            Terminal Ativo
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <Card className="glass border-restaurant-200/50">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[200px] h-12">
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
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Receitas */}
            {mockReceitas
              .filter((receita) =>
                receita.nome.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((receita) => (
                <Card
                  key={receita.id}
                  className="glass border-restaurant-200/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => addToCart(receita, "receita")}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-full flex items-center justify-center mx-auto">
                        <Receipt className="w-6 h-6 text-restaurant-600" />
                      </div>
                      <h3 className="font-medium text-restaurant-900 text-sm">
                        {receita.nome}
                      </h3>
                      <p className="text-xs text-restaurant-600">
                        {receita.descricao}
                      </p>
                      <div className="text-lg font-bold text-restaurant-700">
                        {formatCurrency(receita.preco_sugerido)}
                      </div>
                      <Badge>Receita</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Produtos Finais */}
            {filteredProducts.map((produto) => (
              <Card
                key={produto.id}
                className="glass border-restaurant-200/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => addToCart(produto, "produto")}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-restaurant-100 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingCart className="w-6 h-6 text-restaurant-600" />
                    </div>
                    <h3 className="font-medium text-restaurant-900 text-sm">
                      {produto.nome}
                    </h3>
                    <p className="text-xs text-restaurant-600">
                      Estoque: {produto.estoque} {produto.unidade}
                    </p>
                    <div className="text-lg font-bold text-restaurant-700">
                      {formatCurrency(produto.preco_unitario * 2.5)}
                    </div>
                    <Badge variant="secondary">Produto</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card className="glass border-restaurant-200/50">
            <CardHeader>
              <CardTitle className="flex items-center text-restaurant-900">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-restaurant-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Carrinho vazio</p>
                  <p className="text-sm">
                    Adicione produtos para iniciar uma venda
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-restaurant-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-restaurant-900">
                            {item.item.nome}
                          </h4>
                          <p className="text-xs text-restaurant-600">
                            {formatCurrency(item.unitPrice)} cada
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold text-restaurant-900">
                      <span>Total:</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Select defaultValue="dinheiro">
                      <SelectTrigger>
                        <SelectValue placeholder="Forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">💵 Dinheiro</SelectItem>
                        <SelectItem value="cartao">💳 Cartão</SelectItem>
                        <SelectItem value="pix">📱 PIX</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full"
                      onClick={finalizeSale}
                      disabled={cart.length === 0}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Finalizar Venda
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass border-restaurant-200/50">
            <CardHeader>
              <CardTitle className="text-restaurant-900">
                Resumo do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-restaurant-600">Vendas:</span>
                <span className="font-medium">8 pedidos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-restaurant-600">Faturamento:</span>
                <span className="font-medium">{formatCurrency(456.5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-restaurant-600">Ticket Médio:</span>
                <span className="font-medium">{formatCurrency(57.06)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
