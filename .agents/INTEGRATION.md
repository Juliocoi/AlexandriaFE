# Documentação Oficial de Integração: Alexandria API (Front-end Guide)

Esta documentação foi elaborada para orientar a ferramenta de IA na refatoração completa do projeto **Alexandria** (construído em React 19, React Router v7, TypeScript e Tailwind CSS v4).

> **ATENÇÃO (Fonte da Verdade):** O **Back-end é a fonte absoluta da verdade**. Qualquer propriedade, nome de campo, rota ou regra de negócio divergente entre o front-end atual (mockado) e esta documentação deve ser imediatamente refatorada para manter **100% de compatibilidade com a API**.

---

## 1. Diretrizes Gerais de Arquitetura Front-end

* **URL Base da API:** `http://localhost:8080`
* **Autenticação (JWT):** Todas as requisições autenticadas devem incluir o cabeçalho HTTP:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
  
* **Gerenciamento de Sessão:** O token JWT e os dados do usuário (`user`) retornados no login devem ser armazenados de forma segura (ex: `localStorage` ou sessionStorage).

* **Imagens Locais:** Como as capas dos livros não serão hospedadas em CDN externa neste momento, a propriedade `coverUrl` deve aceitar caminhos de assets locais da aplicação front-end (ex: `"/images/books/1984.jpg"`).

* **Tratamento de Erros:** A API retorna erros padronizados no seguinte formato JSON:

  JSON

  ```
  {
    "status": 400,
    "error": "Bad Request",
    "message": "Descrição amigável do erro",
    "timestamp": "18/11/2026 17:05:12",
    "fieldErrors": { "campo": "Mensagem específica por campo" }
  }
  ```

## 2. Mapa de Rotas e Payloads da API

### A. Autenticação (`/api/auth`)

#### 1. Realizar Login

- **Método:** `POST`

- **Rota:** `/api/auth/login`

- **Acesso:** Público

- **Payload de Envio (Request):**

  JSON

  ```
  {
    "email": "william@email.com",
    "password": "senhaSegura123"
  }
  ```

- **Resposta de Sucesso (`200 OK`):**

  JSON

  ```
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
      "name": "William Cauã",
      "email": "william@email.com",
      "birthDate": "15/05/2004",
      "motherName": "Maria das Graças",
      "fatherName": "José Carlos",
      "role": "STUDENT"
    }
  }
  ```

### B. Usuários (`/api/users`)

#### 1. Auto-cadastro de Aluno

- **Método:** `POST`

- **Rota:** `/api/users/register`

- **Acesso:** Público (o perfil será fixado como `STUDENT` no back-end)

- **Payload de Envio (Request):**

  JSON

  ```
  {
    "name": "William Cauã",
    "email": "william@email.com",
    "password": "senhaSegura123",
    "birthDate": "15/05/2004",
    "motherName": "Maria das Graças",
    "fatherName": "José Carlos"
  }
  ```

- **Resposta de Sucesso (`201 Created`):** Retorna o objeto `UserResponse` (mesmo formato do objeto `user` retornado no login).

#### 2. Consultar Perfil / Atualizar Perfil

- **Visualizar (`GET /api/users/{id}`):** Requer token. O aluno só pode ver o próprio perfil.

- **Atualizar (`PUT /api/users/{id}`):**

  JSON

  ```
  {
    "name": "William Cauã Atualizado",
    "email": "william@email.com",
    "password": "novaSenhaOpcional123",
    "birthDate": "15/05/2004",
    "motherName": "Maria das Graças",
    "fatherName": "José Carlos"
  }
  ```

### C. Catálogo de Livros (`/api/books`)

#### 1. Listar / Buscar Livros (Home e Catálogo)

- **Método:** `GET`

- **Rota:** `/api/books`

- **Query Parameters Opcionais:** `?title=...`, `?author=...`, `?category=...`, `?query=...` (barra de busca geral do topo).

- **Acesso:** Autenticado (`STUDENT` ou `STAFF`)

- **Resposta de Sucesso (`200 OK`):** Retorna um array de livros:

  JSON

  ```
  [
    {
      "id": "f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c",
      "coverUrl": "/images/books/1984.jpg",
      "isbn": "978-8535914849",
      "title": "1984",
      "author": "George Orwell",
      "coAuthor": null,
      "releaseDate": "08/06/1949",
      "edition": 1,
      "publisher": "Companhia das Letras",
      "bookshelf": "Ficcao-A1",
      "totalCopies": 3,
      "availableCopies": 2,
      "isAvailable": true,
      "category": "Ficção",
      "synopsis": "Em uma sociedade totalitária...",
      "pages": 416,
      "language": "Português"
    }
  ]
  ```

#### 2. Cadastrar / Editar Livro (Exclusivo para Funcionários - `STAFF`)

- **Criar (`POST /api/books`):**

  JSON

  ```
  {
    "coverUrl": "/images/books/sapiens.jpg",
    "isbn": "978-8535925558",
    "title": "Sapiens",
    "author": "Yuval Noah Harari",
    "bookshelf": "Tech-B2",
    "totalCopies": 5,
    "category": "Não-Ficção",
    "pages": 448,
    "language": "Português"
  }
  ```

- **Atualizar Estoque (`PATCH /api/books/{id}/copies`):** Usado pelo funcionário para adicionar novos exemplares físicos que chegaram.

  JSON

  ```
  {
    "quantity": 2
  }
  ```

### D. Empréstimos (`/api/loans`)

#### 1. Realizar Empréstimo de Livro

- **Método:** `POST`

- **Rota:** `/api/loans`

- **Acesso:** Autenticado

- **Payload de Envio (Request):**

  JSON

  ```
  {
    "userId": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
    "bookId": "f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c"
  }
  ```

- **Resposta de Sucesso (`201 Created`):**

  JSON

  ```
  {
    "id": "e1f2a3b4-c5d6-e7f8-a9b0-c1d2e3f4a5b6",
    "userId": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
    "userName": "William Cauã",
    "bookId": "f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c",
    "bookTitle": "1984",
    "bookAuthor": "George Orwell",
    "bookCoverUrl": "/images/books/1984.jpg",
    "loanDate": "18/11/2026",
    "dueDate": "02/12/2026",
    "returnDate": null,
    "status": "ACTIVE",
    "message": "Empréstimo realizado com sucesso!"
  }
  ```

#### 2. Devolver Livro

- **Método:** `PATCH`

- **Rota:** `/api/loans/{loanId}/return`

- **Payload de Envio (Request):**

  JSON

  ```
  {
    "userId": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c"
  }
  ```

#### 3. Listar Empréstimos do Usuário (Tela "Meu Perfil" / "Meus Livros")

- **Método:** `GET`
- **Rota:** `/api/loans/user/{userId}`
- **Resposta:** Retorna um array de `LoanResponse`.

### E. Favoritos (`/api/users/{userId}/favorites`)

#### 1. Listar Livros Favoritos (Para a seção de Destaques da Home)

- **Método:** `GET`
- **Rota:** `/api/users/{userId}/favorites`
- **Resposta:** Retorna um array de `BookResponse`.

#### 2. Favoritar um Livro

- **Método:** `POST`
- **Rota:** `/api/users/{userId}/favorites/{bookId}`
- **Resposta:** `204 No Content`

#### 3. Desfavoritar um Livro

- **Método:** `DELETE`
- **Rota:** `/api/users/{userId}/favorites/{bookId}`
- **Resposta:** `204 No Content`

## 3. Instruções Específicas para a IA implementar no Front-end

1. **Substituição do `localStorage` antigo:** Remover qualquer lógica de mock estático de livros e usuários. O front-end deve consumir os endpoints reais do back-end (`http://localhost:8080`).
2. **Implementação da Feature de Favoritos:**
   - Na página `Home`, criar uma seção superior consumindo `GET /api/users/{userId}/favorites`.
   - No card de detalhes do livro, incluir o botão interativo de favoritar/desfavoritar que dispara o `POST` ou `DELETE` na rota correspondente.
3. **Regra de Limite de Empréstimos:** O back-end possui uma trava rígida de **no máximo 4 empréstimos ativos simultâneos**. O front-end deve tratar a exceção HTTP `400 Bad Request` exibindo a mensagem amigável retornada pela API caso o aluno tente exceder esse limite.
4. **Proteção de Rotas baseada em `role`:** O menu e as telas de cadastro/edição de livros devem ser exibidos apenas se `user.role === 'STAFF'`. Alunos (`STUDENT`) visualizam apenas o catálogo, favoritos, perfil e empréstimos.