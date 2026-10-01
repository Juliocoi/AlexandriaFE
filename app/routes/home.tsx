import { Link, NavLink } from "react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  BookOpen, Home as HomeIcon, Library, Bookmark, User, LogOut,
  Search, Bell, ArrowRight, Star,
} from "lucide-react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Início | Biblioteca Virtual" },
    { name: "description", content: "Encontre o livro perfeito para o seu momento." },
  ];
}

import { DESTAQUES, type Livro } from "../data/livros";

const MENU = [
  { to: "/", label: "Início", icon: HomeIcon },
  { to: "/catalogo", label: "Catálogo", icon: Library },
  { to: "/meus-livros", label: "Meus Livros", icon: Bookmark },
  { to: "/perfil", label: "Perfil", icon: User },
];

// Trocar pelo usuário logado
const USUARIO = { nome: "William", foto: "/avatar.jpg" };


function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buscarLivrosPorTitulo(titulo: string): Livro[] {
  const termos = normalizarTexto(titulo)
    .split(/\s+/)
    .filter(Boolean);

  if (termos.length === 0) return [];

  // A busca considera qualquer parte do título. Cada palavra digitada
  // precisa aparecer no título, sem usar o autor como critério.
  return DESTAQUES.filter((livro) => {
    const tituloNormalizado = normalizarTexto(livro.titulo);
    return termos.every((termo) => tituloNormalizado.includes(termo));
  });
}

function ResultadoBusca({ livro }: { livro: Livro }) {
  return (
    <Link
      to={`/livro/${livro.id}`}
      className="flex gap-4 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-3 transition-colors hover:border-[#1D7BF5]"
    >
      <CapaLivro livro={livro} />

      <div className="flex flex-col gap-1 pt-1">
        <h3 className="text-sm font-semibold text-white">{livro.titulo}</h3>
        <p className="text-xs text-[#8A9AB1]">{livro.autor}</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-[#F5B70A] text-[#F5B70A]" />
          ))}
          <span className="ml-1 text-[11px] text-[#8A9AB1]">
            {livro.nota.toFixed(1).replace(".", ",")}
          </span>
        </div>
        <span className={`text-xs ${livro.disponivel ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
          {livro.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </div>
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-[#1A2B45] bg-[#0B1729] p-3 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D7BF5]">
          <BookOpen className="h-4 w-4 text-white" />
        </span>
        <span className="text-sm font-semibold text-white">Biblioteca Virtual</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {MENU.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-[#1D7BF5] text-white" : "text-[#A9B6C9] hover:bg-[#13243D] hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#A9B6C9] hover:bg-[#13243D] hover:text-white">
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </aside>
  );
}

function Topbar({
  busca,
  setBusca,
  onBuscar,
  sugestoes,
}: {
  busca: string;
  setBusca: (valor: string) => void;
  onBuscar: (event: FormEvent<HTMLFormElement>) => void;
  sugestoes: Livro[];
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#1A2B45] px-6 py-3">
      <div className="relative w-full max-w-xl">
        <form
          onSubmit={onBuscar}
          className="relative z-20 flex w-full items-center gap-2 rounded-lg border border-[#1F3352] bg-[#0F1E33] px-3 py-2"
        >
          <Search className="h-4 w-4 shrink-0 text-[#6F819B]" />
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar livro pelo título..."
            aria-label="Buscar livro pelo título"
            autoComplete="off"
            className="w-full bg-transparent text-sm text-white placeholder:text-[#6F819B] outline-none"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar pesquisa"
              className="text-[#A9B6C9] hover:text-white"
            >
              ×
            </button>
          )}
          <button
            type="submit"
            className="rounded-md bg-[#1D7BF5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1668D6]"
          >
            Buscar
          </button>
        </form>

        {busca.trim() && (
          <div className="absolute left-0 right-0 top-full z-10 overflow-hidden rounded-b-xl border border-t-0 border-[#1F3352] bg-[#0F1E33] shadow-2xl">
            {sugestoes.length > 0 ? (
              <div className="p-2">
                <p className="px-2 pb-2 pt-1 text-[11px] text-[#6F819B]">
                  Livros encontrados
                </p>
                {sugestoes.map((livro) => (
                  <Link
                    key={livro.id}
                    to={`/livro/${livro.id}`}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[#13243D]"
                  >
                    <CapaLivro livro={livro} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{livro.titulo}</p>
                      <p className="truncate text-xs text-[#8A9AB1]">{livro.autor}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-4 py-4 text-sm text-[#8A9AB1]">
                Nenhum livro encontrado com esse título.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button aria-label="Notificações" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1F3352] text-[#A9B6C9] hover:text-white">
          <Bell className="h-4 w-4" />
        </button>
        <img src={USUARIO.foto} alt={USUARIO.nome} className="h-9 w-9 rounded-full bg-[#1A2B45] object-cover" />
      </div>
    </header>
  );
}

function CapaLivro({ livro }: { livro: Livro }) {
  const { fundo, texto, destaque } = livro.capa;
  return (
    <div className={`${fundo} ${texto} flex h-28 w-20 shrink-0 flex-col justify-between rounded-sm p-1.5 text-center shadow-md`}>
      <span className="text-[7px] leading-tight">{livro.autor}</span>
      {destaque ? (
        <span className="text-xl font-extrabold">{destaque}</span>
      ) : (
        <BookOpen className="mx-auto h-5 w-5 opacity-80" />
      )}
      <span className="text-[7px] leading-tight">{livro.titulo}</span>
    </div>
  );
}

function CardLivro({ livro }: { livro: Livro }) {
  return (
    <Link
      to={`/livro/${livro.id}`}
      className="flex gap-4 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-3 transition-colors hover:border-[#1D7BF5]"
    >
      <CapaLivro livro={livro} />
      <div className="flex flex-col gap-1 pt-1">
        <h3 className="text-sm font-semibold text-white">{livro.titulo}</h3>
        <p className="text-xs text-[#8A9AB1]">{livro.autor}</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-[#F5B70A] text-[#F5B70A]" />
          ))}
          <span className="ml-1 text-[11px] text-[#8A9AB1]">{livro.nota.toFixed(1).replace(".", ",")}</span>
        </div>
        <span className={`text-xs ${livro.disponivel ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
          {livro.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Livro[]>([]);
  const [pesquisaEnviada, setPesquisaEnviada] = useState(false);
  const [pesquisando, setPesquisando] = useState(false);
  const [erroBusca, setErroBusca] = useState("");

  function handleBuscaChange(valor: string) {
    setBusca(valor);
    setPesquisaEnviada(false);
    setResultados([]);
    setErroBusca("");
  }

  function handleBuscar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const titulo = busca.trim();

    if (!titulo) {
      setResultados([]);
      setErroBusca("");
      setPesquisaEnviada(false);
      return;
    }

    setPesquisando(true);
    setErroBusca("");

    // O Enter/Buscar pesquisa pelo título e aceita correspondências parciais.
    const livros = buscarLivrosPorTitulo(titulo);
    setResultados(livros);
    setPesquisaEnviada(true);
    setPesquisando(false);
  }

  const sugestoes = busca.trim() ? buscarLivrosPorTitulo(busca) : [];

  return (
    <div className="flex min-h-screen bg-[#08121F] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar
          busca={busca}
          setBusca={handleBuscaChange}
          onBuscar={handleBuscar}
          sugestoes={sugestoes}
        />

        <main className="flex flex-col gap-8 p-6">
          <div>
            <h1 className="text-2xl font-semibold">Olá, {USUARIO.nome}!</h1>
            <p className="text-sm text-[#8A9AB1]">Qual história você vai ler hoje?</p>
          </div>

          {pesquisaEnviada ? (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Resultados para "{busca.trim()}"
                </h2>
                <p className="text-xs text-[#8A9AB1]">
                  Pesquisa realizada somente pelo título dos livros disponíveis
                </p>
              </div>

              {pesquisando && (
                <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6 text-sm text-[#A9B6C9]">
                  Pesquisando livros...
                </div>
              )}

              {!pesquisando && erroBusca && (
                <div className="rounded-xl border border-[#7F1D1D] bg-[#2A1115] p-6 text-sm text-[#FCA5A5]">
                  {erroBusca}
                </div>
              )}

              {!pesquisando && !erroBusca && resultados.length === 0 && (
                <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6 text-sm text-[#A9B6C9]">
                  Nenhum livro encontrado com esse título.
                </div>
              )}

              {!pesquisando && resultados.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {resultados.map((livro) => (
                    <ResultadoBusca key={livro.id} livro={livro} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Banner — imagem em public/hero-livros.jpg */}
              <section className="relative overflow-hidden rounded-xl border border-[#1A2B45] bg-[#061222]">
                <img
                  src="/hero-livros.jpg"
                  alt=""
                  className="absolute inset-y-0 right-0 h-full w-full object-cover object-right md:w-3/5"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#061222] via-[#061222]/85 to-transparent md:via-40%" />

                <div className="relative max-w-md p-6">
                  <span className="rounded-full bg-[#1D7BF5]/20 px-2.5 py-1 text-[10px] font-semibold text-[#6FAEFF]">
                    SUA PRÓXIMA LEITURA
                  </span>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight">
                    Grandes histórias estão te esperando
                  </h2>
                  <p className="mt-3 text-sm text-[#A9B6C9]">
                    Explore novos mundos, descubra autores inesquecíveis e encontre o livro perfeito para o seu momento.
                  </p>
                  <a
                    href="/catalogo"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-4 py-2.5 text-sm font-medium hover:bg-[#1668D6]"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Explorar catálogo
                  </a>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Destaques</h2>
                    <p className="text-xs text-[#8A9AB1]">Os livros mais procurados pelos leitores</p>
                  </div>
                  <a href="/catalogo" className="flex items-center gap-1 text-xs text-[#1D7BF5] hover:underline">
                    Ver catálogo <ArrowRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {DESTAQUES.map((livro) => (
                    <CardLivro key={livro.id} livro={livro} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

