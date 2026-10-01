import type { Route } from "./+types/login";
import { Link } from "react-router";

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

          {/* Formulário */}
          <form className="space-y-4">

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