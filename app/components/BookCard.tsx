interface Book {
    id: string;
    img: string;
    isbn?: string;
    nome: string;
    autor: string;
    anoLancamento?: string;
    coAutor?: string | null;
    edicao?: number;
    editora?: string;
    estante?: string;
    disponivel?: boolean;
    palavraChave?: string;
    isFavorite: boolean;
}

interface BookCardProps {
    book: Book;
    onToggleFavorite?: (id: string) => void;
}

export function BookCard({
    book,
    onToggleFavorite,
}: BookCardProps) {
    return (
        <div className="w-64 overflow-hidden rounded-lg bg-white shadow-md">
            <img
                src={book.img}
                alt={book.nome}
                className="h-80 w-full object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-bold">
                    {book.nome}
                </h2>

                <p className="text-sm text-gray-600">
                    {book.autor}
                </p>

                <button
                    type="button"
                    onClick={() => onToggleFavorite?.(book.id)}
                    className="mt-3 text-2xl"
                    aria-label={
                        book.isFavorite
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                    }
                >
                    {book.isFavorite ? "♥" : "♡"}
                </button>
            </div>
        </div>
    );
}