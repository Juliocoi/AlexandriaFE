import { useState } from "react";
import { BookCard } from "../components/BookCard";

export default function BookCardTest() {
    const [books, setBooks] = useState([
        {
            id: "1",
            img: "https://placehold.co/400x600?text=Clean+Architecture",
            nome: "Clean Architecture",
            autor: "Robert C. Martin",
            isFavorite: false,
        },
        {
            id: "2",
            img: "https://placehold.co/400x600?text=Design+Patterns",
            nome: "Design Patterns",
            autor: "Erich Gamma",
            isFavorite: true,
        },
    ]);

    function toggleFavorite(id: string) {
        setBooks((currentBooks) =>
            currentBooks.map((book) =>
                book.id === id
                    ? {
                          ...book,
                          isFavorite: !book.isFavorite,
                      }
                    : book
            )
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-8 text-2xl font-bold">
                BookCard Test
            </h1>

            <div className="flex flex-wrap gap-6">
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onToggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        </main>
    );
}