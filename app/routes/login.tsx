import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import type { Route } from "./+types/login";
import { ApiError, authApi } from "../lib/api";
import { getStoredUser, getToken, setSession } from "../lib/session";

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
  const justRegistered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (getToken() && getStoredUser()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const localErrors: Record<string, string> = {};
    if (!email.trim()) localErrors.email = "O e-mail é obrigatório.";
    if (!password) localErrors.password = "A senha é obrigatória.";
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });
      setSession(response.token, response.user);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setErrorMessage("Não foi possível realizar o login.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#061426] text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[#061426]/80" />

        <section className="relative z-10 w-full max-w-md rounded-xl border border-[#193653] bg-[#08182b]/95 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1D7BF5]/15 text-[#1D7BF5]">
              <BookOpen className="h-6 w-6" />
            </span>
            <span className="text-lg font-semibold">Biblioteca Virtual</span>
          </div>

          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
            <p className="mt-2 text-sm text-slate-400">
              Acesse sua conta e continue explorando
              <br />
              um mundo de conhecimento.
            </p>
          </div>

          {justRegistered && (
            <div
              role="status"
              className="mb-4 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-xs text-[#86EFAC]"
            >
              Cadastro realizado com sucesso! Faça login para continuar.
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-xs text-[#FCA5A5]"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-slate-300"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="Digite seu e-mail"
                  className="w-full rounded-md border border-[#193653] bg-[#0d2138] py-3 pr-4 pl-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-slate-300"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="Digite sua senha"
                  className="w-full rounded-md border border-[#193653] bg-[#0d2138] py-3 pr-10 pl-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Cadastre-se
            </Link>
          </p>

          <div className="mt-8 border-t border-[#193653] pt-6 text-center">
            <p className="text-xs italic leading-relaxed text-slate-500">
              "Um bom livro é um diálogo
              <br />
              silencioso com as maiores mentes."
            </p>
            <p className="mt-2 text-[11px] text-slate-600">— Desconhecido</p>
          </div>
        </section>
      </div>
    </main>
  );
}
