export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: "admin" | "funcionario";
  cliente_id: string;
}

export interface Cliente {
  id: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  tipo_empresa: string;
  valor_plano: number;
  dia_vencimento: number;
  modulos_ativos: ModulosAtivos;
  ativo: boolean;
  data_criacao: Date;
  email_admin: string; // backward compatibility
}

export interface ModulosAtivos {
  vendas: boolean;
  produtos: boolean;
  receitas: boolean;
  compras: boolean;
  financeiro: boolean;
  alertas: boolean;
  whatsapp: boolean;
  configuracoes: boolean;
}

export interface WhatsAppConfig {
  id: string;
  cliente_id: string;
  numero_whatsapp: string;
  api_url: string;
  api_token: string;
  instance_id?: string;
  mensagens_ativas: {
    estoque_baixo: boolean;
    lista_compras: boolean;
    lembrete_pagamento: boolean;
  };
  templates_mensagem: {
    estoque_baixo: string;
    lista_compras: string;
    lembrete_pagamento: string;
  };
  ultima_conexao?: Date;
  ativo: boolean;
}

export interface LogMensagem {
  id: string;
  cliente_id: string;
  destinatario: string;
  conteudo: string;
  tipo: "manual" | "estoque_baixo" | "lista_compras" | "lembrete_pagamento";
  status: "enviado" | "erro" | "pendente";
  data_envio: Date;
  resposta_api?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: "admin" | "funcionario";
  cliente_id: string;
  ativo: boolean;
  data_criacao: Date;
  ultimo_acesso?: Date;
}

export interface ConfiguracoesSistema {
  cliente_id: string;
  idioma: string;
  tema: "light" | "dark";
  valor_alerta_estoque: number;
  unidade_padrao: string;
  tipo_negocio: string;
  notificacoes_email: boolean;
  backup_automatico: boolean;
}

export interface HistoricoPagamento {
  id: string;
  cliente_id: string;
  valor: number;
  data_pagamento: Date;
  status: "pago" | "pendente" | "vencido";
  metodo_pagamento: string;
  numero_fatura: string;
}

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  tipo: "super_admin";
  token?: string;
}

export interface Produto {
  id: string;
  nome: string;
  estoque: number;
  unidade: string;
  preco_unitario: number;
  tipo: "ingrediente" | "produto_final";
  alerta_minimo: number;
  cliente_id: string;
  categoria?: string;
  descricao?: string;
}

export interface Receita {
  id: string;
  nome: string;
  preco_sugerido: number;
  cliente_id: string;
  descricao?: string;
  tempo_preparo?: number;
  ingredientes: ReceitaIngrediente[];
}

export interface ReceitaIngrediente {
  id: string;
  receita_id: string;
  produto_id: string;
  quantidade: number;
  cliente_id: string;
  produto?: Produto;
}

export interface Venda {
  id: string;
  data: Date;
  valor_total: number;
  cliente_id: string;
  itens: VendaItem[];
  forma_pagamento?: string;
  cliente_nome?: string;
}

export interface VendaItem {
  id: string;
  venda_id: string;
  produto_id?: string;
  receita_id?: string;
  quantidade: number;
  valor_unitario: number;
  cliente_id: string;
  produto?: Produto;
  receita?: Receita;
}

export interface Compra {
  id: string;
  data: Date;
  valor_total: number;
  fornecedor: string;
  numero_nota?: string;
  cliente_id: string;
  itens: CompraItem[];
}

export interface CompraItem {
  id: string;
  compra_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  cliente_id: string;
  produto?: Produto;
}

export interface DespesaFixa {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  vencimento: Date;
  cliente_id: string;
  categoria:
    | "salarios"
    | "energia"
    | "aluguel"
    | "agua"
    | "internet"
    | "plano_saas"
    | "outros";
  status: "pendente" | "pago";
}

export interface RelatorioFinanceiro {
  periodo_inicio: Date;
  periodo_fim: Date;
  total_vendas: number;
  total_despesas: number;
  total_compras: number;
  lucro_bruto: number;
  despesas_por_categoria: { [key: string]: number };
  vendas_por_dia: { data: Date; valor: number }[];
}

export interface AlertaEstoque {
  produto: Produto;
  estoque_atual: number;
  estoque_minimo: number;
  sugestao_compra: number;
}

export interface NotificacaoWhatsApp {
  id: string;
  tipo: "estoque_baixo" | "lista_compras" | "relatorio_vendas";
  mensagem: string;
  enviado: boolean;
  data_envio?: Date;
  cliente_id: string;
}
