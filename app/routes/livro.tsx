import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit3,
  Globe,
  Heart,
  Layers,
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";
import type { Route } from "./+types/livro";
import { BookCover } from "../components/BookCover";
import { SessionGuard } from "../components/SessionGuard";
import { ApiError, booksApi, favoritesApi, loansApi } from "../lib/api";
import type { Book, User } from "../types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detalhes do Livro | Biblioteca Virtual" },
    {
      name: "description",
      content: "Veja detalhes, disponibilidade e realize empréstimos.",
    },
  ];
}

function LivroContent({ user, bookId }: { user: User; bookId: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiesToAdd, setCopiesToAdd] = useState("1");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allBooks, favList] = await Promise.all([
        booksApi.list(),
        favoritesApi.list(user.id),
      ]);
      const found = allBooks.find((item) => item.id === bookId) ?? null;
      setBook(found);
      setIsFavorite(favList.some((fav) => fav.id === bookId));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível carregar os detalhes do livro."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, user.id]);

  const handleToggleFavorite = async () => {
    if (!book || busyAction) return;
    setBusyAction(true);
    setError(null);
    setFeedback(null);
    try {
      if (isFavorite) {
        await favoritesApi.remove(user.id, book.id);
        setIsFavorite(false);
        setFeedback("Livro removido dos favoritos.");
      } else {
        await favoritesApi.add(user.id, book.id);
        setIsFavorite(true);
        setFeedback("Livro adicionado aos favoritos!");
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar seus favoritos."
      );
    } finally {
      setBusyAction(false);
    }
  };

  const handleBorrow = async () => {
    if (!book || busyAction) return;
    setBusyAction(true);
    setError(null);
    setFeedback(null);
    try {
      const loan = await loansApi.create({
        userId: user.id,
        bookId: book.id,
      });
      setFeedback(
        loan.message ??
          `Empréstimo realizado com sucesso! Devolução prevista para ${loan.dueDate}.`
      );
      await loadData();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível realizar o empréstimo.");
      }
    } finally {
      setBusyAction(false);
    }
  };

  const handleAddCopies = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!book || busyAction) return;
    const quantity = Number.parseInt(copiesToAdd, 10);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Informe uma quantidade válida maior que zero.");
      return;
    }

    setBusyAction(true);
    setError(null);
    setFeedback(null);
    try {
      const updated = await booksApi.addCopies(book.id, { quantity });
      setBook(updated);
      setCopiesToAdd("1");
      setFeedback(`${quantity} exemplar(es) adicionado(s) ao acervo.`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar o estoque."
      );
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <>
      <div>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-[#A9B6C9] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catálogo
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-[#8A9AB1]">
          <Loader2 className="h-4 w-4 animate-spin text-[#1D7BF5]" />
          <span>Carregando detalhes do livro...</span>
        </div>
      ) : !book ? (
        <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-8 text-center">
          <p className="text-base font-semibold text-white">
            Livro não encontrado
          </p>
          <p className="mt-1 text-sm text-[#8A9AB1]">
            {error ?? "O livro solicitado não está disponível no catálogo."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]"
            >
              {error}
            </div>
          )}

          {feedback && (
            <div
              role="status"
              className="rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]"
            >
              {feedback}
            </div>
          )}

          <section className="flex flex-col gap-6 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6 md:flex-row">
            <BookCover
              coverUrl={book.coverUrl}
              title={book.title}
              author={book.author}
              className="mx-auto h-72 w-48 md:mx-0"
            />

            <div className="flex flex-1 flex-col justify-between gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {book.category && (
                    <span className="rounded-full bg-[#1A2B45] px-3 py-1 text-xs font-medium text-[#A9B6C9]">
                      {book.category}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      book.isAvailable
                        ? "bg-[#22C55E]/15 text-[#4ADE80]"
                        : "bg-[#EF4444]/15 text-[#FCA5A5]"
                    }`}
                  >
                    {book.isAvailable
                      ? `Disponível (${book.availableCopies} de ${book.totalCopies} exemplares)`
                      : "Indisponível no momento"}
                  </span>
                </div>

                <h1 className="mt-3 text-3xl font-bold text-white">
                  {book.title}
                </h1>
                <p className="mt-1 text-base text-[#A9B6C9]">
                  {book.author}
                  {book.coAuthor ? ` • Coautor: ${book.coAuthor}` : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#8A9AB1]">
                  <span>ISBN: {book.isbn}</span>
                  {book.publisher && <span>Editora: {book.publisher}</span>}
                  {book.edition && <span>Edição: {book.edition}ª</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    busyAction || !book.isAvailable || book.availableCopies <= 0
                  }
                  onClick={handleBorrow}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1668D6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BookOpen className="h-4 w-4" />
                  Pegar emprestado
                </button>

                <button
                  type="button"
                  disabled={busyAction}
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    isFavorite
                      ? "border-[#EF4444]/50 bg-[#EF4444]/15 text-[#FCA5A5] hover:bg-[#EF4444]/25"
                      : "border-[#1F3352] bg-[#0B1729] text-white hover:border-[#1D7BF5]"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-[#EF4444] text-[#EF4444]" : ""
                    }`}
                  />
                  {isFavorite ? "Favoritado" : "Favoritar"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6">
            <h2 className="text-lg font-semibold text-white">Sinopse</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#A9B6C9]">
              {book.synopsis || "Nenhuma sinopse cadastrada para este livro."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-[#1A2B45] bg-[#0B1729] p-3.5">
                <div className="flex items-center gap-2 text-xs text-[#8A9AB1]">
                  <Layers className="h-4 w-4 text-[#1D7BF5]" />
                  <span>Páginas</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {book.pages}
                </p>
              </div>

              <div className="rounded-lg border border-[#1A2B45] bg-[#0B1729] p-3.5">
                <div className="flex items-center gap-2 text-xs text-[#8A9AB1]">
                  <Calendar className="h-4 w-4 text-[#1D7BF5]" />
                  <span>Publicado em</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {book.releaseDate || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-[#1A2B45] bg-[#0B1729] p-3.5">
                <div className="flex items-center gap-2 text-xs text-[#8A9AB1]">
                  <Globe className="h-4 w-4 text-[#1D7BF5]" />
                  <span>Idioma</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {book.language}
                </p>
              </div>

              <div className="rounded-lg border border-[#1A2B45] bg-[#0B1729] p-3.5">
                <div className="flex items-center gap-2 text-xs text-[#8A9AB1]">
                  <MapPin className="h-4 w-4 text-[#1D7BF5]" />
                  <span>Estante</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {book.bookshelf}
                </p>
              </div>
            </div>
          </section>

          {user.role === "STAFF" && (
            <section className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Gestão de Estoque (Funcionário)
                  </h2>
                  <p className="mt-1 text-xs text-[#8A9AB1]">
                    Adicione novos exemplares físicos ou edite as informações do livro.
                  </p>
                </div>

                <Link
                  to={`/gerenciar-livros?edit=${encodeURIComponent(book.id)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1F3352] bg-[#0B1729] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:border-[#1D7BF5]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Editar dados do livro
                </Link>
              </div>

              <form
                onSubmit={handleAddCopies}
                className="mt-4 flex flex-wrap items-end gap-3"
              >
                <div>
                  <label
                    htmlFor="copiesToAdd"
                    className="mb-1.5 block text-xs text-[#A9B6C9]"
                  >
                    Quantidade de exemplares
                  </label>
                  <input
                    id="copiesToAdd"
                    type="number"
                    min={1}
                    value={copiesToAdd}
                    onChange={(e) => setCopiesToAdd(e.target.value)}
                    className="w-36 rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2 text-sm text-white outline-none focus:border-[#1D7BF5]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busyAction}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1668D6] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar exemplares
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </>
  );
}

export default function Livro() {
  const { id } = useParams();
  return (
    <SessionGuard>
      {({ user }) => <LivroContent user={user} bookId={id ?? ""} />}
    </SessionGuard>
  );
}
