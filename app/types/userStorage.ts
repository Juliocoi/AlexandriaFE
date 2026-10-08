import type { User } from "./user";

// Chave única compartilhada com a tela de login
export const USERS_STORAGE_KEY = "users";
export const CURRENT_USER_STORAGE_KEY = "alexandria_current_user";

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

export function emailExists(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return getUsers().some((user) => user.email.toLowerCase() === normalized);
}

export function saveUser(user: User): void {
  const users = getUsers();
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, user]));
}

// Encontrar usuário por credenciais (Login)
export function findUserByCredentials(email: string, password: string): User | null {
  const normalized = email.trim().toLowerCase();
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === normalized && u.password === password) ?? null;
}

// FObtem usuário logado (Home)
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// Salvar usuário logado (Home)
export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Erro ao salvar sessão do usuário:", error);
  }
}

// Limpar sessão do usuário (Home)
export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar sessão do usuário:", error);
  }
}

