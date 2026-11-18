export type Livro = {
  id: number;
  titulo: string;
  autor: string;
  nota: number;
  disponivel: boolean;
  capa: { fundo: string; texto: string; destaque?: string };
};

// Dados de exemplo — trocar pela API quando o back-end estiver pronto
export const DESTAQUES: Livro[] = [
  { id: 1, titulo: "1984", autor: "George Orwell", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#B3202A]", texto: "text-white", destaque: "1984" } },
  { id: 2, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#0E3A6B]", texto: "text-white" } },
  { id: 3, titulo: "Sapiens", autor: "Yuval Noah Harari", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#EADFC2]", texto: "text-[#3A3328]" } },
  { id: 4, titulo: "Dom Casmurro", autor: "Machado de Assis", nota: 4.8, disponivel: true,
    capa: { fundo: "bg-[#1C1C1C]", texto: "text-white" } },
];
