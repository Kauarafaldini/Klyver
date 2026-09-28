import {
  Cliente,
  User,
  Produto,
  Receita,
  Venda,
  Compra,
  DespesaFixa,
  AlertaEstoque,
  RelatorioFinanceiro,
  WhatsAppConfig,
  LogMensagem,
  Usuario,
  ConfiguracoesSistema,
  HistoricoPagamento,
} from "./types";

// Mock current user and client
export const mockCurrentUser: User = {
  id: "user_001",
  nome: "João Silva",
  email: "joao@lanchonete.com",
  tipo: "admin",
  cliente_id: "cliente_001",
};

export const mockCliente: Cliente = {
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
    configuracoes: true,
  },
  ativo: true,
  data_criacao: new Date("2024-01-15"),
  email_admin: "joao@lanchonete.com",
};

// Mock products with realistic restaurant items
export const mockProdutos: Produto[] = [
  {
    id: "prod_001",
    nome: "Pão de Hambúrguer",
    estoque: 45,
    unidade: "un",
    preco_unitario: 1.5,
    tipo: "ingrediente",
    alerta_minimo: 50,
    cliente_id: "cliente_001",
    categoria: "Pães",
    descricao: "Pão artesanal para hambúrguer com gergelim",
  },
  {
    id: "prod_002",
    nome: "Carne Bovina 120g",
    estoque: 15,
    unidade: "un",
    preco_unitario: 8.5,
    tipo: "ingrediente",
    alerta_minimo: 20,
    cliente_id: "cliente_001",
    categoria: "Carnes",
    descricao: "Hambúrguer artesanal de carne bovina",
  },
  {
    id: "prod_003",
    nome: "Queijo Cheddar",
    estoque: 8,
    unidade: "fatias",
    preco_unitario: 0.8,
    tipo: "ingrediente",
    alerta_minimo: 30,
    cliente_id: "cliente_001",
    categoria: "Laticínios",
  },
  {
    id: "prod_006",
    nome: "Batata Frita",
    estoque: 150,
    unidade: "porções",
    preco_unitario: 3.5,
    tipo: "produto_final",
    alerta_minimo: 50,
    cliente_id: "cliente_001",
    categoria: "Acompanhamentos",
  },
  {
    id: "prod_007",
    nome: "Refrigerante Lata",
    estoque: 75,
    unidade: "un",
    preco_unitario: 2.5,
    tipo: "produto_final",
    alerta_minimo: 100,
    cliente_id: "cliente_001",
    categoria: "Bebidas",
  },
];

// Mock recipes
export const mockReceitas: Receita[] = [
  {
    id: "receita_001",
    nome: "X-Burger Clássico",
    preco_sugerido: 18.5,
    cliente_id: "cliente_001",
    descricao: "Hambúrguer tradicional com carne, queijo, alface e tomate",
    tempo_preparo: 8,
    ingredientes: [
      {
        id: "ri_001",
        receita_id: "receita_001",
        produto_id: "prod_001",
        quantidade: 1,
        cliente_id: "cliente_001",
      },
      {
        id: "ri_002",
        receita_id: "receita_001",
        produto_id: "prod_002",
        quantidade: 1,
        cliente_id: "cliente_001",
      },
    ],
  },
];

// Mock sales data
export const mockVendas: Venda[] = [
  {
    id: "venda_001",
    data: new Date("2024-01-15T14:30:00"),
    valor_total: 43.5,
    cliente_id: "cliente_001",
    forma_pagamento: "Cartão",
    cliente_nome: "Maria Santos",
    itens: [],
  },
];

// Mock stock alerts
export const mockAlertasEstoque: AlertaEstoque[] = [
  {
    produto: mockProdutos[1], // Carne Bovina
    estoque_atual: 15,
    estoque_minimo: 20,
    sugestao_compra: 30,
  },
  {
    produto: mockProdutos[2], // Queijo Cheddar
    estoque_atual: 8,
    estoque_minimo: 30,
    sugestao_compra: 50,
  },
];

// Mock financial report
export const mockRelatorioFinanceiro: RelatorioFinanceiro = {
  periodo_inicio: new Date("2024-01-01"),
  periodo_fim: new Date("2024-01-31"),
  total_vendas: 12450.0,
  total_despesas: 6780.0,
  total_compras: 3200.0,
  lucro_bruto: 2470.0,
  despesas_por_categoria: {
    aluguel: 2500.0,
    energia: 480.0,
    salarios: 3600.0,
    outros: 200.0,
  },
  vendas_por_dia: [
    { data: new Date("2024-01-15"), valor: 850.0 },
    { data: new Date("2024-01-16"), valor: 920.0 },
    { data: new Date("2024-01-17"), valor: 760.0 },
    { data: new Date("2024-01-18"), valor: 1100.0 },
    { data: new Date("2024-01-19"), valor: 980.0 },
    { data: new Date("2024-01-20"), valor: 1050.0 },
    { data: new Date("2024-01-21"), valor: 890.0 },
  ],
};

// Mock dashboard metrics
export const mockDashboardMetrics = {
  vendas_hoje: 8,
  faturamento_hoje: 456.5,
  produtos_baixo_estoque: mockAlertasEstoque.length,
  pedidos_pendentes: 3,
  crescimento_vendas: 12.5,
  ticket_medio: 28.7,
  produtos_mais_vendidos: [
    { nome: "X-Burger Clássico", quantidade: 45 },
    { nome: "X-Bacon Especial", quantidade: 32 },
    { nome: "Batata Frita", quantidade: 78 },
  ],
  horarios_pico: [
    { horario: "12:00", vendas: 15 },
    { horario: "13:00", vendas: 23 },
    { horario: "14:00", vendas: 18 },
    { horario: "19:00", vendas: 28 },
    { horario: "20:00", vendas: 31 },
    { horario: "21:00", vendas: 19 },
  ],
};

// Mock WhatsApp configuration
export const mockWhatsAppConfig: WhatsAppConfig = {
  id: "whatsapp_001",
  cliente_id: "cliente_001",
  numero_whatsapp: "+5511999999999",
  api_url: "https://api.z-api.io",
  api_token: "EAAZBob...",
  instance_id: "A20DA9C0183A2D35A20DA9C0183A2D35",
  mensagens_ativas: {
    estoque_baixo: true,
    lista_compras: false,
    lembrete_pagamento: true,
  },
  templates_mensagem: {
    estoque_baixo:
      "🚨 *Alerta de Estoque*\n\nO produto *{{produto}}* está com estoque baixo.\n\nEstoque atual: {{quantidade}} {{unidade}}\nEstoque mínimo: {{minimo}} {{unidade}}\n\nSugestão de compra: {{sugestao}} {{unidade}}",
    lista_compras:
      "📋 *Lista de Compras Semanal*\n\nProdutos para comprar:\n{{lista}}\n\nTotal estimado: R$ {{total}}",
    lembrete_pagamento:
      "💰 *Lembrete de Pagamento*\n\nSeu plano vence em {{dias}} dias.\n\nValor: R$ {{valor}}\nVencimento: {{data}}\n\nMantenha seu sistema sempre ativo!",
  },
  ultima_conexao: new Date("2024-01-20T10:30:00"),
  ativo: true,
};

// Mock message logs
export const mockLogsMensagens: LogMensagem[] = [
  {
    id: "log_001",
    cliente_id: "cliente_001",
    destinatario: "+5511999999999",
    conteudo:
      "🚨 *Alerta de Estoque*\n\nO produto *Carne Bovina* está com estoque baixo.\n\nEstoque atual: 15 kg\nEstoque mínimo: 20 kg\n\nSugestão de compra: 30 kg",
    tipo: "estoque_baixo",
    status: "enviado",
    data_envio: new Date("2024-01-20T09:15:00"),
    resposta_api: '{"status": "success", "message_id": "msg_123456"}',
  },
  {
    id: "log_002",
    cliente_id: "cliente_001",
    destinatario: "+5511888888888",
    conteudo: "Mensagem de teste do sistema WhatsApp",
    tipo: "manual",
    status: "enviado",
    data_envio: new Date("2024-01-19T16:45:00"),
    resposta_api: '{"status": "success", "message_id": "msg_123455"}',
  },
  {
    id: "log_003",
    cliente_id: "cliente_001",
    destinatario: "+5511777777777",
    conteudo:
      "💰 *Lembrete de Pagamento*\n\nSeu plano vence em 3 dias.\n\nValor: R$ 89,90\nVencimento: 10/02/2024\n\nMantenha seu sistema sempre ativo!",
    tipo: "lembrete_pagamento",
    status: "erro",
    data_envio: new Date("2024-01-18T14:20:00"),
    resposta_api: '{"status": "error", "message": "Invalid phone number"}',
  },
];

// Mock users
export const mockUsuarios: Usuario[] = [
  {
    id: "user_001",
    nome: "João Silva",
    email: "joao@lanchonete.com",
    tipo: "admin",
    cliente_id: "cliente_001",
    ativo: true,
    data_criacao: new Date("2024-01-15"),
    ultimo_acesso: new Date("2024-01-20T10:30:00"),
  },
  {
    id: "user_002",
    nome: "Maria Santos",
    email: "maria@lanchonete.com",
    tipo: "funcionario",
    cliente_id: "cliente_001",
    ativo: true,
    data_criacao: new Date("2024-01-16"),
    ultimo_acesso: new Date("2024-01-19T18:45:00"),
  },
  {
    id: "user_003",
    nome: "Carlos Oliveira",
    email: "carlos@lanchonete.com",
    tipo: "funcionario",
    cliente_id: "cliente_001",
    ativo: false,
    data_criacao: new Date("2024-01-10"),
    ultimo_acesso: new Date("2024-01-15T14:20:00"),
  },
];

// Mock system settings
export const mockConfiguracoesSistema: ConfiguracoesSistema = {
  cliente_id: "cliente_001",
  idioma: "pt-BR",
  tema: "light",
  valor_alerta_estoque: 10,
  unidade_padrao: "unid",
  tipo_negocio: "Lanchonete",
  notificacoes_email: true,
  backup_automatico: true,
};

// Mock payment history
export const mockHistoricoPagamentos: HistoricoPagamento[] = [
  {
    id: "pag_001",
    cliente_id: "cliente_001",
    valor: 89.9,
    data_pagamento: new Date("2024-01-10"),
    status: "pago",
    metodo_pagamento: "Cartão de Crédito",
    numero_fatura: "FAT-2024-001",
  },
  {
    id: "pag_002",
    cliente_id: "cliente_001",
    valor: 89.9,
    data_pagamento: new Date("2023-12-10"),
    status: "pago",
    metodo_pagamento: "PIX",
    numero_fatura: "FAT-2023-012",
  },
  {
    id: "pag_003",
    cliente_id: "cliente_001",
    valor: 89.9,
    data_pagamento: new Date("2023-11-10"),
    status: "pago",
    metodo_pagamento: "Cartão de Crédito",
    numero_fatura: "FAT-2023-011",
  },
];

// Available plans
export const mockPlanos = [
  {
    id: "basico",
    nome: "Básico",
    valor: 69.9,
    descricao: "Ideal para pequenos negócios",
    modulos: ["vendas", "produtos", "alertas"],
  },
  {
    id: "padrao",
    nome: "Padrão",
    valor: 89.9,
    descricao: "Para empresas em crescimento",
    modulos: [
      "vendas",
      "produtos",
      "receitas",
      "compras",
      "alertas",
      "whatsapp",
    ],
  },
  {
    id: "premium",
    nome: "Premium",
    valor: 129.9,
    descricao: "Solução completa para restaurantes",
    modulos: [
      "vendas",
      "produtos",
      "receitas",
      "compras",
      "financeiro",
      "alertas",
      "whatsapp",
      "configuracoes",
    ],
  },
  {
    id: "enterprise",
    nome: "Enterprise",
    valor: 159.9,
    descricao: "Para grandes operações",
    modulos: [
      "vendas",
      "produtos",
      "receitas",
      "compras",
      "financeiro",
      "alertas",
      "whatsapp",
      "configuracoes",
      "relatorios_avancados",
    ],
  },
];
