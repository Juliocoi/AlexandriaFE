import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";



export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("book-card-test", "routes/book-card-test.tsx"),
] satisfies RouteConfig;
  route("cadastro", "routes/cadastro.tsx"),
] satisfies RouteConfig;

