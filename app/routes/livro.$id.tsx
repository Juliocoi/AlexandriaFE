import { Link, useParams } from "react-router";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { DESTAQUES } from "../data/livros";
import type { Route } from "./+types/livro.$id";

export function meta({ params }: Route.MetaArgs) {
  const livro = DESTAQUES.find((item) => item.id === Number(params.id));
  return [
    { title: livro ? `${livro.titulo} | Biblioteca Virtual` : "Livro | Biblioteca Virtual" },
    { name: "description", content: livro ? `Detalhes do livro ${livro.titulo}.` : "Detalhes do livro." },
  ];
}

function CapaLivro({ livro }: { livro: (typeof DESTAQUES)[number] }) {
  const { fundo, texto, destaque } = livro.capa;
  return (
    <div className={`${fundo} ${texto} flex h-[420px] w-[280px] shrink-0 flex-col justify-between rounded-lg p-5 text-center shadow-2xl`}>
      <span className="text-sm leading-tight">{livro.autor}</span>
      {destaque ? (
        <span className="text-5xl font-extrabold">{destaque}</span>
      ) : (
        <BookOpen className="mx-auto h-16 w-16 opacity-80" />
      )}
      <span className="text-sm leading-tight">{livro.titulo}</span>
    </div>
  );
}

export default function LivroPage() {
  const { id } = useParams();
  const livro = DESTAQUES.find((item) => item.id === Number(id));

  if (!livro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08121F] p-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Livro não encontrado</h1>
          <p className="mt-2 text-sm text-[#8A9AB1]">Esse livro não está disponível no catálogo atual.</p>
          <Link to="/" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-4 py-2.5 text-sm font-medium hover:bg-[#1668D6]">
            <ArrowLeft className="h-4 w-4" />
            Voltar para início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#08121F] text-white">
      <main className="mx-auto max-w-6xl p-6 md:p-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[#A9B6C9] hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Voltar para início
        </Link>

        <section className="flex flex-col gap-8 rounded-2xl border border-[#1A2B45] bg-[#0B1729] p-6 md:flex-row md:p-8">
          <CapaLivro livro={livro} />

          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6FAEFF]">Detalhes do livro</span>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{livro.titulo}</h1>
            <p className="mt-2 text-base text-[#A9B6C9]">por {livro.autor}</p>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#F5B70A] text-[#F5B70A]" />
                ))}
              </div>
              <span className="text-sm text-[#A9B6C9]">{livro.nota.toFixed(1).replace(".", ",")}</span>
            </div>

            <p className={`mt-4 text-sm font-medium ${livro.disponivel ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {livro.disponivel ? "Disponível para empréstimo" : "Indisponível"}
            </p>

            <div className="mt-8 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-5">
              <h2 className="font-semibold">Sobre o livro</h2>
              <p className="mt-2 text-sm leading-6 text-[#A9B6C9]">
                Aqui serão exibidas as informações completas do livro. Esta página já está preparada para receber os dados do backend quando o catálogo for integrado à API.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
