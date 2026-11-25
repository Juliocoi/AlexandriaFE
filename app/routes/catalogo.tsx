import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { Loader2, Search } from "lucide-react";
import type { Route } from "./+types/catalogo";
import { BookCard } from "../components/BookCard";
import { SessionGuard } from "../components/SessionGuard";
import { ApiError, booksApi, favoritesApi } from "../lib/api";
import type { Book, User } from "../types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Catálogo | Biblioteca Virtual" },
    {
      name: "description",
      content: "Explore nosso acervo e encontre o livro ideal para você.",
    },
  ];
}

function CatalogoContent({ user }: { user: User }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [books, setBooks] = useState<Book[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(searchParams.get("query") ?? "");
    setSelectedCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      const query = searchParams.get("query")?.trim() || undefined;
      const category = searchParams.get("category")?.trim() || undefined;

      try {
        const [bookList, favList] = await Promise.all([
          booksApi.list({ query, category }),
          favoritesApi.list(user.id),
        ]);
        if (!active) return;

        setBooks(bookList);
        setFavoriteIds(new Set(favList.map((b) => b.id)));

        setAllCategories((prev) => {
          const merged = new Set(prev);
          for (const b of bookList) {
            if (b.category) merged.add(b.category);
          }
          return Array.from(merged).sort((a, b) => a.localeCompare(b));
        });
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível carregar o catálogo."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [searchParams, user.id]);

  const categories = useMemo(() => ["Todos", ...allCategories], [allCategories]);

  const applyFilters = (nextQuery: string, nextCategory: string) => {
    const next = new URLSearchParams();
    if (nextQuery.trim()) next.set("query", nextQuery.trim());
    if (nextCategory && nextCategory !== "Todos") {
      next.set("category", nextCategory);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyFilters(searchInput, selectedCategory);
  };

  const handleToggleFavorite = async (bookId: string) => {
    const currentlyFavorite = favoriteIds.has(bookId);
    try {
      if (currentlyFavorite) {
        await favoritesApi.remove(user.id, bookId);
      } else {
        await favoritesApi.add(user.id, bookId);
      }
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (currentlyFavorite) next.delete(bookId);
        else next.add(bookId);
        return next;
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar os favoritos."
      );
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Catálogo</h1>
        <p className="text-sm text-[#8A9AB1]">
          Explore nosso acervo e encontre o livro ideal para você.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="flex flex-1 items-center gap-2 rounded-lg border border-[#1F3352] bg-[#0F1E33] px-3.5 py-2.5 focus-within:border-[#1D7BF5]">
            <Search className="h-4 w-4 shrink-0 text-[#6F819B]" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por título, autor ou categoria..."
              className="w-full bg-transparent text-sm text-white placeholder:text-[#6F819B] outline-none"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-[#1D7BF5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1668D6]"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive =
              (cat === "Todos" && !selectedCategory) ||
              cat === selectedCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => applyFilters(searchInput, cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#1D7BF5] text-white"
                    : "border border-[#1A2B45] bg-[#0F1E33] text-[#A9B6C9] hover:border-[#1D7BF5] hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-[#8A9AB1]">
          <Loader2 className="h-4 w-4 animate-spin text-[#1D7BF5]" />
          <span>Buscando livros no acervo...</span>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33]/60 p-8 text-center text-sm text-[#8A9AB1]">
          Nenhum livro encontrado para os filtros selecionados.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={favoriteIds.has(book.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function Catalogo() {
  const [searchParams] = useSearchParams();
  return (
    <SessionGuard initialSearch={searchParams.get("query") ?? ""}>
      {({ user }) => <CatalogoContent user={user} />}
    </SessionGuard>
  );
}
