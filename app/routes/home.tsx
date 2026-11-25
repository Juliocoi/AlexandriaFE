import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import type { Route } from "./+types/home";
import { BookCover } from "../components/BookCover";
import { SessionGuard } from "../components/SessionGuard";
import { ApiError, booksApi, favoritesApi } from "../lib/api";
import type { Book, User } from "../types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Início | Biblioteca Virtual" },
    {
      name: "description",
      content: "Explore nosso acervo e encontre o próximo livro favorito.",
    },
  ];
}

function BookPoster({ book }: { book: Book }) {
  return (
    <Link
      to={`/livro/${book.id}`}
      className="group flex flex-col gap-2 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-3 transition-colors hover:border-[#1D7BF5]"
    >
      <BookCover
        coverUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        className="aspect-[2/3] w-full"
      />
      <div className="min-w-0 pt-1">
        <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#6FAEFF]">
          {book.title}
        </h3>
        <p className="truncate text-xs text-[#8A9AB1]">{book.author}</p>
        <span
          className={`mt-1 inline-block text-[11px] font-medium ${
            book.isAvailable ? "text-[#22C55E]" : "text-[#EF4444]"
          }`}
        >
          {book.isAvailable
            ? `Disponível (${book.availableCopies})`
            : "Indisponível"}
        </span>
      </div>
    </Link>
  );
}

function HomeContent({ user }: { user: User }) {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [favList, bookList] = await Promise.all([
          favoritesApi.list(user.id),
          booksApi.list(),
        ]);
        if (!active) return;
        setFavorites(favList);
        setBooks(bookList);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível carregar os livros da biblioteca."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user.id]);

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const highlights = books.slice(0, 5);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Olá, {firstName}!</h1>
        <p className="text-sm text-[#8A9AB1]">
          Que tal descobrir um novo livro hoje?
        </p>
      </div>

      <section className="relative overflow-hidden rounded-xl border border-[#1A2B45] bg-[#061222]">
        <img
          src="/hero-livros.jpg"
          alt=""
          className="absolute inset-y-0 right-0 h-full w-full object-cover object-right md:w-3/5"
        />
        <div className="bg-gradient-to-r absolute inset-0 from-[#061222] via-[#061222]/85 to-transparent md:via-40%" />

        <div className="relative max-w-md p-6">
          <span className="rounded-full bg-[#1D7BF5]/20 px-2.5 py-1 text-[10px] font-semibold text-[#6FAEFF]">
            SUA PRÓXIMA LEITURA
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            Grandes histórias estão te esperando
          </h2>
          <p className="mt-3 text-sm text-[#A9B6C9]">
            Explore nosso acervo e encontre o próximo livro favorito.
          </p>
          <Link
            to="/catalogo"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1668D6]"
          >
            <ArrowRight className="h-4 w-4" />
            Explorar catálogo
          </Link>
        </div>
      </section>

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
          <span>Carregando acervo e favoritos...</span>
        </div>
      ) : (
        <>
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#EF4444]" />
                <div>
                  <h2 className="text-xl font-semibold">Seus Favoritos</h2>
                  <p className="text-xs text-[#8A9AB1]">
                    Livros marcados por você para leitura rápida
                  </p>
                </div>
              </div>
              <Link
                to="/catalogo"
                className="flex items-center gap-1 text-xs text-[#1D7BF5] hover:underline"
              >
                Explorar acervo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33]/60 p-6 text-sm text-[#8A9AB1]">
                Você ainda não favoritou nenhum livro. Acesse o{" "}
                <Link
                  to="/catalogo"
                  className="text-[#1D7BF5] hover:underline"
                >
                  catálogo
                </Link>{" "}
                para adicionar seus favoritos.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {favorites.map((book) => (
                  <BookPoster key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold">Destaques</h2>
                <p className="text-xs text-[#8A9AB1]">
                  Livros disponíveis no acervo da biblioteca
                </p>
              </div>
              <Link
                to="/catalogo"
                className="flex items-center gap-1 text-xs text-[#1D7BF5] hover:underline"
              >
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {highlights.length === 0 ? (
              <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33]/60 p-6 text-sm text-[#8A9AB1]">
                Nenhum livro cadastrado no acervo até o momento.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {highlights.map((book) => (
                  <BookPoster key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default function Home() {
  return <SessionGuard>{({ user }) => <HomeContent user={user} />}</SessionGuard>;
}
