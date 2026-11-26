# Alexandria - Biblioteca Virtual

O **Alexandria** é uma aplicação web responsiva para gerenciamento e exploração de uma biblioteca virtual. O projeto permite que usuários consultem o acervo, pesquisem livros, gerenciem favoritos e empréstimos, editem seus dados e, quando possuem o perfil de funcionário, cadastrem e atualizem livros.

Esta etapa utiliza integração com uma API REST desenvolvida em **Java, Spring Boot e JPA**.

Repositório do back-end:

- https://github.com/Juliocoi/AlexandriaFEBack

Projeto desenvolvido para a disciplina **Front-end Frameworks**, do curso de graduação da **Uninassau**, sob orientação do **Professor Dr. Diogo Francisco Borba Rodrigues**.

## Funcionalidades

### Usuários

- Cadastro de usuários.
- Login com token de autenticação.
- Visualização e edição do perfil.
- Alternância para exibição e ocultação da senha.
- Persistência do token e dos dados do usuário no `localStorage`.
- Redirecionamento automático para o login quando não há sessão válida.
- Perfil de aluno (`STUDENT`) ou funcionário (`STAFF`).

### Acervo

- Listagem de livros.
- Busca por título, autor ou termo geral.
- Filtro por categoria.
- Visualização dos detalhes do livro.
- Consulta de disponibilidade e quantidade de exemplares.
- Gerenciamento de favoritos.
- Destaques e listagem de livros disponíveis na página inicial.

### Empréstimos

- Realização de empréstimos.
- Consulta do histórico e dos empréstimos ativos.
- Devolução de livros.
- Exibição de data de retirada e previsão de devolução.
- Limite visual de quatro empréstimos ativos.

### Área administrativa

- Área exclusiva para usuários com papel `STAFF`.
- Cadastro de novos livros.
- Edição das informações de livros já cadastrados.
- Inclusão de exemplares no estoque.
- Upload de imagens de capa em formatos JPG, PNG, WEBP ou GIF.
- Limite de 5 MB por arquivo de capa.

## Stack do projeto

| Tecnologia | Finalidade |
| :--- | :--- |
| React 19 | Construção da interface baseada em componentes |
| React Router 8 | Rotas, navegação e estrutura da aplicação |
| TypeScript | Tipagem estática |
| Vite 8 | Servidor de desenvolvimento e empacotamento |
| Tailwind CSS 4 | Estilização responsiva |
| Lucide React | Ícones SVG |
| localStorage | Persistência do token e dos dados da sessão no navegador |
| Docker | Empacotamento e execução da aplicação |

## Arquitetura

```text
app/
├── components/       Componentes compartilhados de interface
├── hooks/            Hooks reutilizáveis
├── lib/              Cliente HTTP, sessão e utilitários
├── routes/           Páginas e endpoints do React Router
├── types/            Contratos TypeScript de usuários, livros e empréstimos
├── root.tsx          Estrutura raiz da aplicação
├── routes.ts         Configuração das rotas
└── app.css           Estilos globais
```

A comunicação com o back-end está concentrada em [app/lib/api.ts](/Users/coi/projetos/Alexandria/app/lib/api.ts).

Os dados da sessão são gerenciados por [app/lib/session.ts](/Users/coi/projetos/Alexandria/app/lib/session.ts), enquanto a proteção das páginas autenticadas é aplicada pelo componente [app/components/SessionGuard.tsx](/Users/coi/projetos/Alexandria/app/components/SessionGuard.tsx).

## Rotas

| Rota | Página |
| :--- | :--- |
| `/` | Página inicial |
| `/login` | Login |
| `/cadastro` | Cadastro de usuário |
| `/catalogo` | Catálogo e filtros |
| `/livro/:id` | Detalhes do livro |
| `/meus-livros` | Empréstimos e favoritos |
| `/perfil` | Perfil do usuário |
| `/gerenciar-livros` | Cadastro e gestão do acervo |

A página de gerenciamento aceita o parâmetro `?edit=:id` para abrir diretamente o formulário preenchido com os dados de um livro.

## Pré-requisitos

- Git
- Node.js 24 ou compatível
- npm
- Back-end Java/Spring Boot disponível

## Instalação

Clone os repositórios:

```bash
git clone https://github.com/Juliocoi/AlexandriaFE.git
git clone https://github.com/Juliocoi/AlexandriaFEBack.git
```

Entre na pasta do front-end:

```bash
cd AlexandriaFE
npm install
```

## Configuração da API

Por padrão, o front-end tenta se conectar ao back-end em:

```text
http://localhost:8080
```

Para utilizar outro endereço, crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

Reinicie o servidor de desenvolvimento após alterar essa configuração.

O cliente envia o token da sessão no header das requisições autenticadas:

```text
Authorization: Bearer <token>
```

As principais operações são:

- Login e cadastro de usuários.
- Consulta e edição de usuários.
- Consulta, cadastro e edição de livros.
- Inclusão de exemplares.
- Consulta e manipulação de favoritos.
- Criação, consulta e devolução de empréstimos.

O back-end deve permitir as requisições do front-end durante o desenvolvimento, incluindo a origem `http://localhost:5173`, caso o controle CORS seja aplicado.

## Executando o projeto

Com o back-end configurado e em execução, inicie o front-end:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

## Fluxo inicial de uso

1. Inicie o back-end Java/Spring Boot.
2. Inicie o front-end.
3. Acesse `http://localhost:5173`.
4. Crie uma conta em `/cadastro`.
5. Faça login em `/login`.
6. Explore o catálogo e adicione livros aos favoritos.
7. Realize ou devolva empréstimos em “Meus Livros”.
8. Se a conta tiver o papel `STAFF`, acesse “Gerenciar Acervo”.

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

Descrição dos scripts:

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: gera o build de produção do React Router e do cliente.
- `npm run start`: inicia o servidor com o build já gerado.
- `npm run typecheck`: gera os tipos das rotas e executa a validação do TypeScript.

## Upload de capas

O upload é realizado pelo endpoint interno do React Router:

```text
POST /api/upload-cover
```

A imagem enviada é salva em `public/images/books` e retorna uma URL relativa, por exemplo:

```text
/images/books/nome-do-livro-1234567890.jpg
```

O nome do arquivo é baseado no título do livro e inclui uma marca temporal para reduzir conflitos. O endpoint aceita arquivos de até 5 MB nos formatos JPG, PNG, WEBP e GIF.

## Docker

O projeto possui um [Dockerfile](/Users/coi/projetos/Alexandria/Dockerfile) com etapas separadas para dependências, build e produção.

### Construir a imagem

```bash
docker build -t alexandria-fe .
```

### Executar o contêiner

```bash
docker run --rm -p 3000:3000 alexandria-fe
```

Caso o front-end no contêiner seja executado em ambiente diferente do desenvolvimento local, configure `VITE_API_URL` de acordo com a URL publicada do back-end.

> Observação: o upload salva arquivos no diretório local da aplicação. Em ambientes com arquivos temporários ou contêineres distribuídos, uma solução de armazenamento persistente ou armazenamento de objetos deve ser considerada.

## Testes e qualidade

O projeto atualmente não possui um script de testes automatizados ou suíte de testes configurada. O script disponível para validação estática é:

```bash
npm run typecheck
```

Antes de entregar uma versão, é recomendado executar também:

```bash
npm run build
```

## Segurança e responsabilidades

- O token JWT e os dados do usuário são armazenados no navegador.
- Operações administrativas exibidas na interface devem ser validadas também pelo back-end.
- O front-end deve ser considerado uma interface; o back-end deve impedir ações não autorizadas mesmo em chamadas feitas diretamente.
- A variável `VITE_API_URL` não deve conter credenciais ou dados sensíveis.
- Senhas não devem ser armazenadas no `localStorage`.

## Equipe

- Erick Lourenço Gouveia - 01823433
- Guilherme Pereira Amaral - 01546872
- Júlio César Amorim de Souza - 01024947
- Maria Carolina Barata de Leon - 01645776
- Thiago Pinheiro da Cruz Gouveia - 01530836
- Victor Augusto Pereira Lira - 01825974
- William Cauã Santa Silva - 01804463
