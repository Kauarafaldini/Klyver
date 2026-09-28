import React, { useState, useEffect } from "react";
import { API_URL } from "./services/api";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "OWNER";
}

export default function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Verifica se já existe sessão salva ao abrir
  useEffect(() => {
    const savedUser = localStorage.getItem("@klyver:user");
    const savedToken = localStorage.getItem("@klyver:token");
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("@klyver:user");
        localStorage.removeItem("@klyver:token");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister 
        ? { name, email, password } 
        : { email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha na requisição");
      }

      if (isRegister) {
        setSuccess("Conta criada com sucesso! Você já pode fazer login.");
        setIsRegister(false);
        setPassword("");
      } else {
        // Salva token e usuário
        localStorage.setItem("@klyver:token", data.token);
        localStorage.setItem("@klyver:user", JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("@klyver:token");
    localStorage.removeItem("@klyver:user");
    setCurrentUser(null);
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
  };

  // Se o usuário logado for ADMIN, exibe o painel administrativo completo
  if (currentUser && currentUser.role === "ADMIN") {
    return <AdminPanel onLogout={handleLogout} />;
  }

  // Se for outro tipo de usuário autenticado
  if (currentUser) {
    return (
      <div className="login-container logged-card">
        <div className="brand-logo">Klyver</div>
        <div style={{ marginTop: "1rem" }}>
          <span className="user-badge">{currentUser.role}</span>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
            Olá, {currentUser.name}! 👋
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {currentUser.email}
          </p>
        </div>

        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "rgba(10, 13, 20, 0.4)",
          borderRadius: "10px",
          textAlign: "left",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}>
          <p><strong>ID:</strong> {currentUser.id}</p>
          <p><strong>API:</strong> {API_URL}</p>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Sair da Conta
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="brand-header">
        <div className="brand-logo">Klyver</div>
        <div className="brand-subtitle">
          {isRegister ? "Crie sua nova conta" : "Acesse o painel com suas credenciais"}
        </div>
      </div>

      {error && (
        <div className="alert-message alert-error">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="alert-message alert-success">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <div className="input-wrapper">
              <input
                id="name"
                className="input-field"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegister}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <div className="input-wrapper">
            <input
              id="email"
              className="input-field"
              type="email"
              placeholder="admin@klyver.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <div className="input-wrapper">
            <input
              id="password"
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Processando...
            </>
          ) : isRegister ? (
            "Criar Conta"
          ) : (
            "Entrar na Plataforma"
          )}
        </button>
      </form>

      <div className="auth-toggle-link">
        {isRegister ? (
          <>
            Já tem uma conta?
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
                setSuccess(null);
              }}
            >
              Fazer Login
            </button>
          </>
        ) : (
          <>
            Ainda não tem conta?
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
                setSuccess(null);
              }}
            >
              Cadastre-se
            </button>
          </>
        )}
      </div>
    </div>
  );
}
