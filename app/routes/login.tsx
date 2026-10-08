import type { Route } from "./+types/login";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  findUserByCredentials,
  getCurrentUser,
  setCurrentUser,
} from "../types/userStorage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | Biblioteca Virtual" },
    {
      name: "description",
      content: "Acesse sua conta na Biblioteca Virtual",
    },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Se o usuário veio da tela de cadastro com sucesso
  useEffect(() => {
    if (location.state && (location.state as { registered?: boolean }).registered) {
      setSuccessMessage("Conta criada com sucesso! Faça login para continuar.");
    }
  }, [location.state]);

  // Se o usuário já estiver logado, redireciona para a Home
  useEffect(() => {
    const activeUser = getCurrentUser();
    if (activeUser) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Por favor, preencha o e-mail e a senha.");
      return;
    }

    const user = findUserByCredentials(trimmedEmail, password);

    if (!user) {
      setErrorMessage("E-mail ou senha incorretos.");
      return;
    }

    // Salva a sessão ativa
    setCurrentUser(user);

    // Redireciona para a Home
    navigate("/", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#061426] text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">

        {/* Fundo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-[#061426]/80" />

        {/* Card */}
        <section className="relative z-10 w-full max-w-md rounded-xl border border-[#193653] bg-[#08182b]/95 p-8 shadow-2xl backdrop-blur-sm">

          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="text-4xl text-blue-500">
              📖
            </div>

            <span className="text-lg font-semibold">
              Biblioteca Virtual
            </span>
          </div>

          {/* Título */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold">
              Bem-vindo de volta!
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Acesse sua conta e continue explorando
              <br />
              um mundo de conhecimento.
            </p>
          </div>

          {/* Mensagem de sucesso ao cadastrar */}
          {successMessage && (
            <div
              role="status"
              className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-950/60 p-3 text-center text-xs text-emerald-300"
            >
              {successMessage}
            </div>
          )}

          {/* Mensagem de erro */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-500/40 bg-red-950/60 p-3 text-center text-xs text-red-300"
            >
              {errorMessage}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-slate-300"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full rounded-md border border-[#193653] bg-[#0d2138] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-slate-300"
              >
                Senha
              </label>

              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full rounded-md border border-[#193653] bg-[#0d2138] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Entrar
            </button>
          </form>

          {/* Cadastro */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Cadastre-se
            </Link>
          </p>

          {/* Frase */}
          <div className="mt-8 border-t border-[#193653] pt-6 text-center">
            <p className="text-xs italic leading-relaxed text-slate-500">
              "Um bom livro é um diálogo
              <br />
              silencioso com as mentes."
            </p>

            <p className="mt-2 text-[11px] text-slate-600">
              — Desconhecido
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}