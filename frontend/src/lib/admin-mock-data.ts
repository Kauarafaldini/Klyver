import { Cliente, AdminUser, ModulosAtivos, DespesaFixa } from "./types";

// Mock admin user
export const mockAdminUser: AdminUser = {
  id: "admin_001",
  nome: "Administrator",
  email: "admin@sistema.com",
  tipo: "super_admin",
};

// Mock clientes for admin panel
export const mockClientes: Cliente[] = [
  {
    id: "cliente_001",
    nome_fantasia: "Lanchonete do João",
    cnpj: "12.345.678/0001-90",
    email: "joao@lanchonete.com",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
    tipo_empresa: "Lanchonete",
    valor_plano: 89.9,
    dia_vencimento: 10,
    modulos_ativos: {
      vendas: true,
      produtos: true,
      receitas: true,
      compras: true,
      financeiro: true,
      alertas: true,
      whatsapp: true,
    },
    ativo: true,
    data_criacao: new Date("2024-01-15"),
    email_admin: "joao@lanchonete.com",
  },
  {
    id: "cliente_002",
    nome_fantasia: "Pizzaria Bella Vista",
    cnpj: "98.765.432/0001-10",
    email: "contato@bellavista.com",
    telefone: "(11) 88888-8888",
    endereco: "Av. Paulista, 456 - Bela Vista, São Paulo - SP",
    tipo_empresa: "Pizzaria",
    valor_plano: 129.9,
    dia_vencimento: 5,
    modulos_ativos: {
      vendas: true,
      produtos: true,
      receitas: true,
      compras: false,
      financeiro: true,
      alertas: true,
      whatsapp: false,
    },
    ativo: true,
    data_criacao: new Date("2024-02-01"),
    email_admin: "maria@bellavista.com",
  },
];

// Admin dashboard metrics
export const mockAdminMetrics = {
  total_clientes: mockClientes.length,
  clientes_ativos: mockClientes.filter((c) => c.ativo).length,
  receita_mensal_recorrente: mockClientes
    .filter((c) => c.ativo)
    .reduce((sum, c) => sum + c.valor_plano, 0),
  taxa_churn: 5.2, // percentage
  crescimento_mensal: 15.8, // percentage
  modulos_mais_usados: [
    { modulo: "Vendas", uso: 100 },
    { modulo: "Produtos", uso: 95 },
    { modulo: "Financeiro", uso: 75 },
    { modulo: "Alertas", uso: 85 },
    { modulo: "Receitas", uso: 65 },
  ],
  faturamento_por_plano: [
    { plano: "Básico (R$ 69,90)", clientes: 1, receita: 69.9 },
    { plano: "Padrão (R$ 89,90)", clientes: 1, receita: 89.9 },
    { plano: "Premium (R$ 129,90)", clientes: 1, receita: 129.9 },
    { plano: "Enterprise (R$ 159,90)", clientes: 1, receita: 159.9 },
  ],
};

// Tipos de empresa disponíveis
export const tiposEmpresa = [
  "Lanchonete",
  "Pizzaria",
  "Hamburgueria",
  "Restaurante",
  "Café",
  "Padaria",
  "Sorveteria",
  "Food Truck",
  "Delivery",
  "Outros",
];

// Planos disponíveis
export const planosDisponiveis = [
  { nome: "Básico", valor: 69.9, descricao: "Ideal para pequenos negócios" },
  { nome: "Padrão", valor: 89.9, descricao: "Mais popular" },
  { nome: "Premium", valor: 129.9, descricao: "Recursos avançados" },
  { nome: "Enterprise", valor: 159.9, descricao: "Solução completa" },
];
