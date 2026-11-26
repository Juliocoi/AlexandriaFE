import type {
  ApiErrorResponse,
  Book,
  BookQueryParams,
  CreateBookRequest,
  CreateLoanRequest,
  Loan,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ReturnLoanRequest,
  UpdateBookRequest,
  UpdateCopiesRequest,
  UpdateUserRequest,
  User,
} from "../types/api";
import { clearSession, getToken } from "./session";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  error: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;

  constructor(payload: ApiErrorResponse) {
    super(payload.message || "Ocorreu um erro na requisição.");
    this.name = "ApiError";
    this.status = payload.status;
    this.error = payload.error;
    this.timestamp = payload.timestamp;
    this.fieldErrors = payload.fieldErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);
  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError({
      status: 0,
      error: "Network Error",
      message: "Não foi possível conectar ao servidor da biblioteca (http://localhost:8080).",
      timestamp: new Date().toISOString(),
    });
  }

  if (response.status === 401 && auth) {
    clearSession();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.assign("/login");
    }
  }

  if (!response.ok) {
    let parsed: Partial<ApiErrorResponse> | null = null;
    try {
      parsed = (await response.json()) as Partial<ApiErrorResponse>;
    } catch {
      parsed = null;
    }

    throw new ApiError({
      status: parsed?.status ?? response.status,
      error: parsed?.error ?? response.statusText,
      message:
        parsed?.message ??
        `Erro ${response.status}: não foi possível concluir a operação.`,
      timestamp: parsed?.timestamp ?? new Date().toISOString(),
      fieldErrors: parsed?.fieldErrors,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
};

export const usersApi = {
  register(payload: RegisterRequest): Promise<User> {
    return request<User>("/api/users/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },

  getById(id: string): Promise<User> {
    return request<User>(`/api/users/${encodeURIComponent(id)}`);
  },

  update(id: string, payload: UpdateUserRequest): Promise<User> {
    return request<User>(`/api/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: payload,
    });
  },
};

export const booksApi = {
  list(params?: BookQueryParams): Promise<Book[]> {
    const search = new URLSearchParams();
    if (params?.title) search.set("title", params.title);
    if (params?.author) search.set("author", params.author);
    if (params?.category) search.set("category", params.category);
    if (params?.query) search.set("query", params.query);
    const qs = search.toString();
    return request<Book[]>(`/api/books${qs ? `?${qs}` : ""}`);
  },

  create(payload: CreateBookRequest): Promise<Book> {
    return request<Book>("/api/books", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: UpdateBookRequest): Promise<Book> {
    return request<Book>(`/api/books/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: payload,
    });
  },

  addCopies(id: string, payload: UpdateCopiesRequest): Promise<Book> {
    return request<Book>(`/api/books/${encodeURIComponent(id)}/copies`, {
      method: "PATCH",
      body: payload,
    });
  },
};

export const loansApi = {
  create(payload: CreateLoanRequest): Promise<Loan> {
    return request<Loan>("/api/loans", {
      method: "POST",
      body: payload,
    });
  },

  returnBook(loanId: string, payload: ReturnLoanRequest): Promise<Loan> {
    return request<Loan>(`/api/loans/${encodeURIComponent(loanId)}/return`, {
      method: "PATCH",
      body: payload,
    });
  },

  listByUser(userId: string): Promise<Loan[]> {
    return request<Loan[]>(`/api/loans/user/${encodeURIComponent(userId)}`);
  },
};

export const favoritesApi = {
  list(userId: string): Promise<Book[]> {
    return request<Book[]>(`/api/users/${encodeURIComponent(userId)}/favorites`);
  },

  add(userId: string, bookId: string): Promise<void> {
    return request<void>(
      `/api/users/${encodeURIComponent(userId)}/favorites/${encodeURIComponent(bookId)}`,
      { method: "POST" }
    );
  },

  remove(userId: string, bookId: string): Promise<void> {
    return request<void>(
      `/api/users/${encodeURIComponent(userId)}/favorites/${encodeURIComponent(bookId)}`,
      { method: "DELETE" }
    );
  },
};
