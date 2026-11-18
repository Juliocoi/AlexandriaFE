import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("cadastro", "routes/cadastro.tsx"),
  route("catalogo", "routes/catalogo.tsx"),
  route("livro/:id", "routes/livro.tsx"),
  route("meus-livros", "routes/meus-livros.tsx"),
  route("perfil", "routes/perfil.tsx"),
  route("gerenciar-livros", "routes/gerenciar-livros.tsx"),
] satisfies RouteConfig;
