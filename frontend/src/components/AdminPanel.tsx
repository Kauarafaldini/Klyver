import { useState, useEffect } from "react";
import { API_URL } from "../services/api";

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  maxEmployees?: number;
  maxProducts?: number;
  active: boolean;
}

interface Establishment {
  id: string;
  companyName: string;
  fantasyName: string;
  cnpj: string;
  owner: {
    name: string;
    email: string;
  };
  plan: {
    name: string;
  };
}

interface Log {
  id: string;
  action: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"plans" | "establishments" | "logs">("plans");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newPlan, setNewPlan] = useState({ name: "", description: "", price: "", maxEmployees: "", maxProducts: "" });
  const [showPlanModal, setShowPlanModal] = useState(false);

  const token = localStorage.getItem("@klyver:token");

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro na requisição");
    return data;
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "plans") {
        const data = await fetchWithAuth("/admin/plans");
        setPlans(data);
      } else if (activeTab === "establishments") {
        const data = await fetchWithAuth("/admin/establishments");
        setEstablishments(data);
      } else if (activeTab === "logs") {
        const data = await fetchWithAuth("/admin/logs");
        setLogs(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/admin/plans", {
        method: "POST",
        body: JSON.stringify({
          name: newPlan.name,
          description: newPlan.description,
          price: parseFloat(newPlan.price),
          maxEmployees: newPlan.maxEmployees ? parseInt(newPlan.maxEmployees) : null,
          maxProducts: newPlan.maxProducts ? parseInt(newPlan.maxProducts) : null,
        }),
      });
      setShowPlanModal(false);
      setNewPlan({ name: "", description: "", price: "", maxEmployees: "", maxProducts: "" });
      loadData();
    } catch (err: any) {
      alert("Erro ao criar plano: " + err.message);
    }
  };

  const handleTogglePlan = async (id: string) => {
    try {
      await fetchWithAuth(`/admin/plans/${id}/toggle`, { method: "PATCH" });
      loadData();
    } catch (err: any) {
      alert("Erro ao alterar status: " + err.message);
    }
  };

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-brand">
          <span className="brand-logo">Klyver</span>
          <span className="badge-admin">Painel Administrativo</span>
        </div>
        <button className="btn-logout-small" onClick={onLogout}>
          Sair
        </button>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "plans" ? "active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          📦 Planos ({plans.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "establishments" ? "active" : ""}`}
          onClick={() => setActiveTab("establishments")}
        >
          🏢 Empresas ({establishments.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          📜 Logs de Auditoria
        </button>
      </nav>

      {error && <div className="alert-message alert-error" style={{ margin: "1rem 0" }}>⚠️ {error}</div>}

      {/* Tab Content */}
      <main className="admin-content">
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <span className="spinner"></span>
            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* PLANOS */}
            {activeTab === "plans" && (
              <div>
                <div className="section-header">
                  <h2>Gestão de Planos</h2>
                  <button className="btn-primary" onClick={() => setShowPlanModal(true)}>
                    + Novo Plano
                  </button>
                </div>

                <div className="grid-cards">
                  {plans.map((p) => (
                    <div key={p.id} className="admin-card">
                      <div className="card-header">
                        <h3>{p.name}</h3>
                        <span className={`status-pill ${p.active ? "active" : "inactive"}`}>
                          {p.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <p className="card-desc">{p.description || "Sem descrição"}</p>
                      <div className="card-price">
                        R$ {p.price.toFixed(2)} <small>/mês</small>
                      </div>
                      <div className="card-meta">
                        <span>👥 Máx Funcionários: <strong>{p.maxEmployees ?? "Ilimitado"}</strong></span>
                        <span>📦 Máx Produtos: <strong>{p.maxProducts ?? "Ilimitado"}</strong></span>
                      </div>
                      <button
                        className={`btn-toggle ${p.active ? "btn-deactivate" : "btn-activate"}`}
                        onClick={() => handleTogglePlan(p.id)}
                      >
                        {p.active ? "Desativar Plano" : "Ativar Plano"}
                      </button>
                    </div>
                  ))}
                  {plans.length === 0 && (
                    <p style={{ color: "var(--text-muted)", gridColumn: "1/-1" }}>
                      Nenhum plano cadastrado. Clique em "+ Novo Plano" para começar.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* EMPRESAS */}
            {activeTab === "establishments" && (
              <div>
                <div className="section-header">
                  <h2>Empresas Cadastradas</h2>
                </div>

                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>CNPJ</th>
                        <th>Dono</th>
                        <th>Plano</th>
                      </tr>
                    </thead>
                    <tbody>
                      {establishments.map((e) => (
                        <tr key={e.id}>
                          <td>
                            <strong>{e.companyName}</strong>
                            <br />
                            <small style={{ color: "var(--text-muted)" }}>{e.fantasyName}</small>
                          </td>
                          <td>{e.cnpj}</td>
                          <td>
                            {e.owner?.name}
                            <br />
                            <small style={{ color: "var(--text-muted)" }}>{e.owner?.email}</small>
                          </td>
                          <td>
                            <span className="badge-plan">{e.plan?.name}</span>
                          </td>
                        </tr>
                      ))}
                      {establishments.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                            Nenhuma empresa cadastrada ainda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LOGS */}
            {activeTab === "logs" && (
              <div>
                <div className="section-header">
                  <h2>Logs do Sistema</h2>
                </div>
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Usuário</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((l) => (
                        <tr key={l.id}>
                          <td>{new Date(l.createdAt).toLocaleString("pt-BR")}</td>
                          <td>{l.user ? `${l.user.name} (${l.user.email})` : "Sistema / Anônimo"}</td>
                          <td><code>{l.action}</code></td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                            Nenhum log registrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Criar Plano */}
      {showPlanModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Criar Novo Plano</h3>
            <form onSubmit={handleCreatePlan} style={{ marginTop: "1rem" }}>
              <div className="form-group">
                <label>Nome do Plano</label>
                <input
                  className="input-field"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="Ex: Plano Pro"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <input
                  className="input-field"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  placeholder="Recursos inclusos..."
                />
              </div>
              <div className="form-group">
                <label>Preço Mensal (R$)</label>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                  placeholder="99.90"
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Máx Funcionários</label>
                  <input
                    className="input-field"
                    type="number"
                    value={newPlan.maxEmployees}
                    onChange={(e) => setNewPlan({ ...newPlan, maxEmployees: e.target.value })}
                    placeholder="Vazio = ilimitado"
                  />
                </div>
                <div className="form-group">
                  <label>Máx Produtos</label>
                  <input
                    className="input-field"
                    type="number"
                    value={newPlan.maxProducts}
                    onChange={(e) => setNewPlan({ ...newPlan, maxProducts: e.target.value })}
                    placeholder="Vazio = ilimitado"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn-cancel" onClick={() => setShowPlanModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" style={{ marginTop: 0 }}>
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
