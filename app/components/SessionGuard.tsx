import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "../hooks/useSession";
import type { User } from "../types/api";
import { AppShell } from "./AppShell";

interface SessionGuardProps {
  initialSearch?: string;
  children: (ctx: { user: User; logout: () => void }) => ReactNode;
}

export function SessionGuard({ initialSearch, children }: SessionGuardProps) {
  const { ready, token, user, logout } = useSession({ requireAuth: true });

  if (!ready || !token || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08121F] text-[#A9B6C9]">
        <div className="flex items-center gap-3 text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[#1D7BF5]" />
          <span>Carregando Biblioteca Virtual...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell user={user} onLogout={logout} initialSearch={initialSearch}>
      {children({ user, logout })}
    </AppShell>
  );
}
