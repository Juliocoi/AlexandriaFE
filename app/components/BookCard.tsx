import { Link } from "react-router";
import { Heart } from "lucide-react";
import type { Book } from "../types/api";
import { BookCover } from "./BookCover";

interface BookCardProps {
  book: Book;
  isFavorite?: boolean;
  onToggleFavorite?: (bookId: string) => void;
}

export function BookCard({
  book,
  isFavorite = false,
  onToggleFavorite,
}: BookCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-4 transition-colors hover:border-[#1D7BF5]">
      <div className="flex gap-4">
        <Link to={`/livro/${book.id}`} className="shrink-0">
          <BookCover
            coverUrl={book.coverUrl}
            title={book.title}
            author={book.author}
            className="h-32 w-22"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/livro/${book.id}`}
                className="line-clamp-2 text-sm font-semibold text-white hover:text-[#6FAEFF]"
              >
                {book.title}
              </Link>
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(book.id)}
                  aria-label={
                    isFavorite
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                  className="shrink-0 rounded-lg p-1.5 text-[#A9B6C9] transition-colors hover:bg-[#13243D] hover:text-white"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite
                        ? "fill-[#EF4444] text-[#EF4444]"
                        : "text-[#8A9AB1]"
                    }`}
                  />
                </button>
              )}
            </div>

            <p className="mt-1 truncate text-xs text-[#8A9AB1]">
              {book.author}
            </p>
            {book.category && (
              <span className="mt-2 inline-block rounded-full bg-[#1A2B45] px-2 py-0.5 text-[11px] text-[#A9B6C9]">
                {book.category}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className={`text-xs font-medium ${
                book.isAvailable ? "text-[#22C55E]" : "text-[#EF4444]"
              }`}
            >
              {book.isAvailable
                ? `Disponível (${book.availableCopies}/${book.totalCopies})`
                : "Indisponível"}
            </span>
            <Link
              to={`/livro/${book.id}`}
              className="rounded-lg bg-[#1D7BF5] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1668D6]"
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
