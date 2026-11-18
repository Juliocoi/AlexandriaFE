export type UserRole = "STUDENT" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
}

export interface Book {
  id: string;
  coverUrl: string;
  isbn: string;
  title: string;
  author: string;
  coAuthor: string | null;
  releaseDate: string;
  edition: number;
  publisher: string;
  bookshelf: string;
  totalCopies: number;
  availableCopies: number;
  isAvailable: boolean;
  category: string;
  synopsis: string;
  pages: number;
  language: string;
}

export interface CreateBookRequest {
  coverUrl: string;
  isbn: string;
  title: string;
  author: string;
  coAuthor?: string | null;
  releaseDate?: string;
  edition?: number;
  publisher?: string;
  bookshelf: string;
  totalCopies: number;
  category: string;
  synopsis?: string;
  pages: number;
  language: string;
}

export interface UpdateCopiesRequest {
  quantity: number;
}

export interface BookQueryParams {
  title?: string;
  author?: string;
  category?: string;
  query?: string;
}

export type LoanStatus = "ACTIVE" | "RETURNED" | "OVERDUE" | string;

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
  message?: string;
}

export interface CreateLoanRequest {
  userId: string;
  bookId: string;
}

export interface ReturnLoanRequest {
  userId: string;
}

export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;
}
