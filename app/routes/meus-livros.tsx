import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, Heart, Loader2, RotateCcw } from "lucide-react";
import type { Route } from "./+types/meus-livros";
import { BookCard } from "../components/BookCard";
import { BookCover } from "../components/BookCover";
import { SessionGuard } from "../components/SessionGuard";
import { ApiError, favoritesApi, loansApi } from "../lib/api";
import type { Book, Loan, User } from "../types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meus Livros | Biblioteca Virtual" },
    {
      name: "description",
      content: "Acompanhe seus empréstimos ativos, histórico e favoritos.",
    },
  ];
}

function MeusLivrosContent({ user }: { user: User }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [loanList, favList] = await Promise.all([
        loansApi.listByUser(user.id),
        favoritesApi.list(user.id),
      ]);
      setLoans(loanList);
      setFavorites(favList);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível carregar seus livros."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleReturn = async (loanId: string) => {
    setReturningId(loanId);
    setError(null);
    setFeedback(null);
    try {
      const updated = await loansApi.returnBook(loanId, { userId: user.id });
      setLoans((prev) =>
        prev.map((item) => (item.id === loanId ? updated : item))
      );
      setFeedback(updated.message ?? "Livro devolvido com sucesso!");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível devolver o livro."
      );
    } finally {
      setReturningId(null);
    }
  };

  const handleRemoveFavorite = async (bookId: string) => {
    try {
      await favoritesApi.remove(user.id, bookId);
      setFavorites((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível remover dos favoritos."
      );
    }
  };

  const activeLoansCount = loans.filter((l) => l.status === "ACTIVE").length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Meus Livros</h1>
          <p className="text-sm text-[#8A9AB1]">
            Gerencie seus empréstimos e livros favoritados.
          </p>
        </div>

        <div className="rounded-lg border border-[#1A2B45] bg-[#0F1E33] px-4 py-2 text-xs text-[#A9B6C9]">
          Empréstimos ativos:{" "}
          <span className="font-semibold text-white">
            {activeLoansCount} / 4
          </span>
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

      {feedback && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-[#8A9AB1]">
          <Loader2 className="h-4 w-4 animate-spin text-[#1D7BF5]" />
          <span>Carregando seus empréstimos e favoritos...</span>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Meus Empréstimos</h2>

            {loans.length === 0 ? (
              <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33]/60 p-6 text-sm text-[#8A9AB1]">
                Você ainda não possui empréstimos registrados.{" "}
                <Link
                  to="/catalogo"
                  className="text-[#1D7BF5] hover:underline"
                >
                  Explorar catálogo
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {loans.map((loan) => {
                  const isActive = loan.status === "ACTIVE";
                  return (
                    <article
                      key={loan.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <Link to={`/livro/${loan.bookId}`} className="shrink-0">
                          <BookCover
                            coverUrl={loan.bookCoverUrl}
                            title={loan.bookTitle}
                            author={loan.bookAuthor}
                            className="h-24 w-16"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/livro/${loan.bookId}`}
                            className="text-base font-semibold text-white hover:text-[#6FAEFF]"
                          >
                            {loan.bookTitle}
                          </Link>
                          <p className="text-xs text-[#8A9AB1]">
                            {loan.bookAuthor}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#A9B6C9]">
                            <span>Retirado em: {loan.loanDate}</span>
                            <span>Vencimento: {loan.dueDate}</span>
                            {loan.returnDate && (
                              <span>Devolvido em: {loan.returnDate}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isActive
                              ? "bg-[#22C55E]/15 text-[#4ADE80]"
                              : "bg-[#1A2B45] text-[#A9B6C9]"
                          }`}
                        >
                          {isActive ? "Ativo" : loan.status === "RETURNED" ? "Devolvido" : loan.status}
                        </span>

                        {isActive && (
                          <button
                            type="button"
                            disabled={returningId === loan.id}
                            onClick={() => handleReturn(loan.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D7BF5] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1668D6] disabled:opacity-50"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            {returningId === loan.id
                              ? "Devolvendo..."
                              : "Devolver"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#EF4444]" />
              <h2 className="text-xl font-semibold">Meus Favoritos</h2>
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33]/60 p-6 text-sm text-[#8A9AB1]">
                Nenhum livro favoritado até o momento.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {favorites.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isFavorite
                    onToggleFavorite={handleRemoveFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default function MeusLivros() {
  return (
    <SessionGuard>
      {({ user }) => <MeusLivrosContent user={user} />}
    </SessionGuard>
  );
}
