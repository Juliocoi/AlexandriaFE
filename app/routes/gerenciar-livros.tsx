import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import { BookPlus, Loader2, Plus, ShieldAlert } from "lucide-react";
import type { Route } from "./+types/gerenciar-livros";
import { BookCover } from "../components/BookCover";
import { SessionGuard } from "../components/SessionGuard";
import { ApiError, booksApi } from "../lib/api";
import { toApiDate } from "../lib/date";
import type { Book, User } from "../types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gerenciar Acervo | Biblioteca Virtual" },
    {
      name: "description",
      content: "Cadastro de livros e gestão de exemplares (Funcionários).",
    },
  ];
}

function GerenciarLivrosContent({ user }: { user: User }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    author: "",
    coAuthor: "",
    isbn: "",
    coverUrl: "/images/books/",
    category: "",
    bookshelf: "",
    totalCopies: "1",
    pages: "",
    language: "Português",
    releaseDate: "",
    edition: "1",
    publisher: "",
    synopsis: "",
  });

  const loadBooks = async () => {
    setLoading(true);
    try {
      const list = await booksApi.list();
      setBooks(list);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível carregar o acervo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === "STAFF") {
      loadBooks();
    }
  }, [user.role]);

  if (user.role !== "STAFF") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-[#EF4444]/40 bg-[#0F1E33] p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-[#EF4444]" />
        <h1 className="mt-4 text-xl font-semibold text-white">
          Acesso Restrito
        </h1>
        <p className="mt-2 text-sm text-[#8A9AB1]">
          Esta área é exclusiva para funcionários (`STAFF`).
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-lg bg-[#1D7BF5] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1668D6]"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCreateBook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFeedback(null);
    setFieldErrors({});

    try {
      const created = await booksApi.create({
        title: form.title.trim(),
        author: form.author.trim(),
        coAuthor: form.coAuthor.trim() || null,
        isbn: form.isbn.trim(),
        coverUrl: form.coverUrl.trim(),
        category: form.category.trim(),
        bookshelf: form.bookshelf.trim(),
        totalCopies: Number.parseInt(form.totalCopies, 10) || 1,
        pages: Number.parseInt(form.pages, 10) || 1,
        language: form.language.trim() || "Português",
        releaseDate: form.releaseDate ? toApiDate(form.releaseDate) : undefined,
        edition: form.edition ? Number.parseInt(form.edition, 10) : undefined,
        publisher: form.publisher.trim() || undefined,
        synopsis: form.synopsis.trim() || undefined,
      });

      setBooks((prev) => [created, ...prev]);
      setFeedback(`Livro "${created.title}" cadastrado com sucesso!`);
      setForm({
        title: "",
        author: "",
        coAuthor: "",
        isbn: "",
        coverUrl: "/images/books/",
        category: "",
        bookshelf: "",
        totalCopies: "1",
        pages: "",
        language: "Português",
        releaseDate: "",
        edition: "1",
        publisher: "",
        synopsis: "",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setError("Não foi possível cadastrar o livro.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCopies = async (bookId: string) => {
    const quantity = Number.parseInt(quantities[bookId] ?? "1", 10);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Informe uma quantidade válida.");
      return;
    }

    setError(null);
    setFeedback(null);
    try {
      const updated = await booksApi.addCopies(bookId, { quantity });
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      setFeedback(
        `Estoque atualizado para "${updated.title}" (${updated.totalCopies} exemplares).`
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar o estoque."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2 text-sm text-white outline-none placeholder:text-[#6F819B] focus:border-[#1D7BF5]";

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Gerenciar Acervo</h1>
        <p className="text-sm text-[#8A9AB1]">
          Cadastre novos títulos e adicione exemplares físicos ao estoque.
        </p>
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
          className="rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]"
        >
          {feedback}
        </div>
      )}

      <section className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookPlus className="h-5 w-5 text-[#1D7BF5]" />
          <h2 className="text-lg font-semibold">Cadastrar Novo Livro</h2>
        </div>

        <form onSubmit={handleCreateBook} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Título *
              </label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Sapiens"
                className={inputClass}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Autor *
              </label>
              <input
                name="author"
                required
                value={form.author}
                onChange={handleChange}
                placeholder="Ex: Yuval Noah Harari"
                className={inputClass}
              />
              {fieldErrors.author && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.author}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Coautor
              </label>
              <input
                name="coAuthor"
                value={form.coAuthor}
                onChange={handleChange}
                placeholder="Opcional"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                ISBN *
              </label>
              <input
                name="isbn"
                required
                value={form.isbn}
                onChange={handleChange}
                placeholder="978-8535925558"
                className={inputClass}
              />
              {fieldErrors.isbn && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.isbn}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Caminho da Capa (`coverUrl`) *
              </label>
              <input
                name="coverUrl"
                required
                value={form.coverUrl}
                onChange={handleChange}
                placeholder="/images/books/sapiens.jpg"
                className={inputClass}
              />
              {fieldErrors.coverUrl && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.coverUrl}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Categoria *
              </label>
              <input
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                placeholder="Ex: Não-Ficção"
                className={inputClass}
              />
              {fieldErrors.category && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.category}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Estante (`bookshelf`) *
              </label>
              <input
                name="bookshelf"
                required
                value={form.bookshelf}
                onChange={handleChange}
                placeholder="Ex: Tech-B2"
                className={inputClass}
              />
              {fieldErrors.bookshelf && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {fieldErrors.bookshelf}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Total de Exemplares *
              </label>
              <input
                name="totalCopies"
                type="number"
                min={1}
                required
                value={form.totalCopies}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Páginas *
              </label>
              <input
                name="pages"
                type="number"
                min={1}
                required
                value={form.pages}
                onChange={handleChange}
                placeholder="448"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Idioma *
              </label>
              <input
                name="language"
                required
                value={form.language}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Editora
              </label>
              <input
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                placeholder="Ex: Companhia das Letras"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[#A9B6C9]">
                Data de Publicação
              </label>
              <input
                name="releaseDate"
                type="date"
                value={form.releaseDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#A9B6C9]">Sinopse</label>
            <textarea
              name="synopsis"
              rows={3}
              value={form.synopsis}
              onChange={handleChange}
              placeholder="Resumo do livro..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1668D6] disabled:opacity-50"
          >
            <BookPlus className="h-4 w-4" />
            {submitting ? "Cadastrando..." : "Cadastrar Livro"}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Acervo Atual</h2>

        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-[#8A9AB1]">
            <Loader2 className="h-4 w-4 animate-spin text-[#1D7BF5]" />
            <span>Carregando livros...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={book.author}
                    className="h-20 w-14"
                  />
                  <div>
                    <Link
                      to={`/livro/${book.id}`}
                      className="text-sm font-semibold text-white hover:text-[#6FAEFF]"
                    >
                      {book.title}
                    </Link>
                    <p className="text-xs text-[#8A9AB1]">
                      {book.author} • Estante: {book.bookshelf}
                    </p>
                    <p className="mt-1 text-xs text-[#A9B6C9]">
                      Disponíveis:{" "}
                      <span className="font-semibold text-white">
                        {book.availableCopies}
                      </span>{" "}
                      / {book.totalCopies}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <input
                    type="number"
                    min={1}
                    aria-label={`Quantidade a adicionar para ${book.title}`}
                    value={quantities[book.id] ?? "1"}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [book.id]: e.target.value,
                      }))
                    }
                    className="w-20 rounded-lg border border-[#1F3352] bg-[#0B1729] px-2.5 py-1.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCopies(book.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#1D7BF5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1668D6]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Exemplares
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function GerenciarLivros() {
  return (
    <SessionGuard>
      {({ user }) => <GerenciarLivrosContent user={user} />}
    </SessionGuard>
  );
}
