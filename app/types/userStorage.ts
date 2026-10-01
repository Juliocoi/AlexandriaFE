import type { User } from "./user";

// Chave única compartilhada com a tela de login
export const USERS_STORAGE_KEY = "users";

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
