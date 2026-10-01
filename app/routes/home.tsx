import { NavLink } from "react-router";
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

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  nota: number;
  disponivel: boolean;
  capa: { fundo: string; texto: string; destaque?: string };
};

// Dados de exemplo — trocar pela API quando o back-end estiver pronto
const DESTAQUES: Livro[] = [
  { id: 1, titulo: "1984", autor: "George Orwell", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#B3202A]", texto: "text-white", destaque: "1984" } },
  { id: 2, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#0E3A6B]", texto: "text-white" } },
  { id: 3, titulo: "Sapiens", autor: "Yuval Noah Harari", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#EADFC2]", texto: "text-[#3A3328]" } },
  { id: 4, titulo: "Dom Casmurro", autor: "Machado de Assis", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#1C1C1C]", texto: "text-white" } },
];

const MENU = [
  { to: "/", label: "Início", icon: HomeIcon },
  { to: "/catalogo", label: "Catálogo", icon: Library },
  { to: "/meus-livros", label: "Meus Livros", icon: Bookmark },
  { to: "/perfil", label: "Perfil", icon: User },
];

// Trocar pelo usuário logado
const USUARIO = { nome: "William", foto: "/avatar.jpg" };

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

function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#1A2B45] px-6 py-3">
      <label className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-[#1F3352] bg-[#0F1E33] px-3 py-2">
        <Search className="h-4 w-4 text-[#6F819B]" />
        <input
          type="search"
          placeholder="Buscar livros, autores ou categorias..."
          className="w-full bg-transparent text-sm text-white placeholder:text-[#6F819B] outline-none"
        />
        <kbd className="rounded bg-[#1A2B45] px-1.5 py-0.5 text-[10px] text-[#8A9AB1]">⌘ K</kbd>
      </label>

      <div className="flex items-center gap-3">
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
    <a
      href={`/livro/${livro.id}`}
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
    </a>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#08121F] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex flex-col gap-8 p-6">
          <div>
            <h1 className="text-2xl font-semibold">Olá, {USUARIO.nome}!</h1>
            <p className="text-sm text-[#8A9AB1]">Qual história você vai ler hoje?</p>
          </div>

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
        </main>
      </div>
    </div>
  );
}
