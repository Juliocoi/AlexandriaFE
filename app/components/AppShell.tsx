import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  BookOpen,
  BookPlus,
  Bookmark,
  ChevronDown,
  Home as HomeIcon,
  Library,
  LogOut,
  Menu,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import type { User } from "../types/api";

interface AppShellProps {
  user: User;
  onLogout: () => void;
  initialSearch?: string;
  children: ReactNode;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  end?: boolean;
}

export function AppShell({
  user,
  onLogout,
  initialSearch = "",
  children,
}: AppShellProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);

  const menuItems: NavItem[] = [
    { to: "/", label: "Início", icon: HomeIcon, end: true },
    { to: "/catalogo", label: "Catálogo", icon: Library },
    { to: "/meus-livros", label: "Meus Livros", icon: Bookmark },
    { to: "/perfil", label: "Perfil", icon: UserIcon },
  ];

  if (user.role === "STAFF") {
    menuItems.push({
      to: "/gerenciar-livros",
      label: "Gerenciar Acervo",
      icon: BookPlus,
    });
  }

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    navigate(
      trimmed
        ? `/catalogo?query=${encodeURIComponent(trimmed)}`
        : "/catalogo"
    );
    setMobileOpen(false);
  };

  const renderNavLinks = (onItemClick?: () => void) => (
    <nav className="flex flex-1 flex-col gap-1">
      {menuItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#1D7BF5] text-white"
                : "text-[#A9B6C9] hover:bg-[#13243D] hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#08121F] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[#1A2B45] bg-[#0B1729] p-3 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-2 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D7BF5]">
            <BookOpen className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold text-white">
            Biblioteca Virtual
          </span>
        </Link>

        {renderNavLinks()}

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A9B6C9] transition-colors hover:bg-[#13243D] hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sair</span>
        </button>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col border-r border-[#1A2B45] bg-[#0B1729] p-4">
            <div className="mb-5 flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D7BF5]">
                  <BookOpen className="h-4 w-4 text-white" />
                </span>
                <span className="text-sm font-semibold text-white">
                  Biblioteca Virtual
                </span>
              </Link>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-[#A9B6C9] hover:bg-[#13243D] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Link
              to="/perfil"
              onClick={() => setMobileOpen(false)}
              className="mb-5 flex items-center gap-3 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D7BF5]/20 text-sm font-semibold text-[#6FAEFF]">
                {firstName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-[#8A9AB1]">{user.email}</p>
              </div>
            </Link>

            {renderNavLinks(() => setMobileOpen(false))}

            <button
              type="button"
              onClick={onLogout}
              className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A9B6C9] transition-colors hover:bg-[#13243D] hover:text-white"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sair</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[#1A2B45] bg-[#08121F]/95 px-4 py-3 sm:px-6">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1F3352] bg-[#0F1E33] text-[#A9B6C9] hover:text-white md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full max-w-md items-center gap-2 rounded-lg border border-[#1F3352] bg-[#0F1E33] px-3 py-2 focus-within:border-[#1D7BF5]"
            >
              <Search className="h-4 w-4 shrink-0 text-[#6F819B]" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar livros, autores ou categorias..."
                className="w-full bg-transparent text-sm text-white placeholder:text-[#6F819B] outline-none"
              />
            </form>
          </div>

          <Link
            to="/perfil"
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#1F3352] bg-[#0F1E33] py-1 pr-3 pl-1.5 transition-colors hover:border-[#1D7BF5]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D7BF5]/20 text-xs font-semibold text-[#6FAEFF]">
              {firstName.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-sm font-medium text-white sm:inline">
              {firstName}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-[#8A9AB1] sm:inline" />
          </Link>
        </header>

        <main className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
