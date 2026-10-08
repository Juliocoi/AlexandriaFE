# Alexandria — Biblioteca Virtual

## 📖 Sobre o Projeto

O **Alexandria** é uma aplicação web Front-end moderna desenvolvida para simular uma Biblioteca Virtual intuitiva, responsiva e agradável. O sistema permite aos leitores explorar um catálogo de livros, realizar buscas por título e autor, interagir com detalhes das obras e gerenciar sua experiência por meio de telas dedicadas de cadastro e login.

Nesta etapa do projeto (AV1), a aplicação opera de forma totalmente independente no lado do cliente (*client-side*), sem integração com serviços de back-end externos. A persistência de dados de usuários, o controle de autenticação e a gestão de sessão ativa são realizados diretamente no navegador por meio da API **`localStorage`**. O catálogo e os dados de exibição dos livros são fornecidos por meio de estruturas mockadas locais escritas em TypeScript.

> **Nota sobre o desenvolvimento:**  
> O layout visual, a arquitetura da interface, o planejamento estrutural do projeto (incluindo a divisão modular de tarefas para o trabalho colaborativo da equipe) e a elaboração deste material de documentação foram concebidos e refinados com o auxílio de **Inteligência Artificial (IA)**.

Este projeto está sendo desenvolvido para avaliação acadêmica da disciplina **Front-end Frameworks**, do curso de graduação da **Uninassau**, sob a tutela e orientação do **Professor Dr. Diogo Francisco Borba Rodrigues**.

---

## ⚙️ Instalação e Execução

Siga os passos abaixo para baixar o código-fonte, instalar as dependências necessárias e executar o ambiente de desenvolvimento localmente.

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gerenciador de pacotes `npm` (incluso com o Node.js)

### 1. Clonar o Repositório

Abra o seu terminal e execute o comando de clonagem:

```bash
git clone git@github.com:Juliocoi/AlexandriaFE.git
```

Em seguida, acesse a pasta do projeto:

```bash
cd AlexandriaFE
```

### 2. Instalar as Dependências

Instale todos os pacotes e bibliotecas listados no `package.json`:

```bash
npm install
```

### 3. Executar o Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento com suporte a recarregamento dinâmico (*Hot Module Replacement*):

```bash
npm run dev
```

### 4. Acessar no Navegador

Após a inicialização do Vite, abra o navegador e acesse:

```
http://localhost:5173
```

> **Fluxo inicial de uso:**  
> 1. Ao abrir a aplicação você será redirecionado para a tela de **Login** (`/login`).  
> 2. Clique em **"Cadastre-se"** para ser levado à página de **Cadastro** (`/cadastro`).  
> 3. Preencha seus dados cadastrais. Ao confirmar, os dados serão salvos no `localStorage` e você retornará ao Login.  
> 4. Efetue o login com suas credenciais para ser encaminhado à **Home** do catálogo.

---

## 🛠️ Stack de Tecnologias

O projeto utiliza um ecossistema moderno voltado à performance, tipagem estática e produtividade no desenvolvimento Front-end:

| Tecnologia | Descrição / Finalidade |
| :--- | :--- |
| **[React](https://react.dev/)** | Biblioteca principal para construção da interface de usuário declarativa baseada em componentes funcionais e hooks. |
| **[React Router v7](https://reactrouter.com/)** | Framework e sistema de roteamento moderno para navegação SPA e gerenciamento de rotas. |
| **[TypeScript](https://www.typescriptlang.org/)** | Superset JavaScript que adiciona tipagem estática estrita, prevenindo bugs e garantindo consistência estrutural. |
| **[Vite](https://vitejs.dev/)** | Build tool e empacotador de alta performance para inicialização instantânea e compilação otimizada. |
| **[Tailwind CSS](https://tailwindcss.com/)** | Framework CSS utilitário para estilização ágil, responsiva e com tema visual escuro (*dark mode*). |
| **[Lucide React](https://lucide.dev/)** | Biblioteca de ícones modernos e leves em formato SVG. |
| **Web Storage API (`localStorage`)** | Mecanismo de persistência no navegador utilizado para armazenamento de contas de usuário e controle da sessão ativa. |

---

## 👥 Membros da Equipe

Projeto desenvolvido pelo time:

- **Erick Lourenço Gouveia - 01823433**
- **Guilherme Pereira Amaral - 01546872 **
- **Júlio César Amorim de Souza - 01024947 **
- **Maria Carolina Barata de Leon - 01645776**
- **Thiago Pinheiro da Cruz Gouveia 01530836**
- **Victor Augusto Pereira Lira - 01825974**
- **William Cauã Santa Silva - 01804463**
