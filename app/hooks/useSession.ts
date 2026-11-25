import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  clearSession,
  getStoredUser,
  getToken,
  subscribeSession,
} from "../lib/session";
import type { User } from "../types/api";

export interface SessionState {
  ready: boolean;
  token: string | null;
  user: User | null;
  logout: () => void;
}

export function useSession(options?: { requireAuth?: boolean }): SessionState {
  const requireAuth = options?.requireAuth ?? true;
  const navigate = useNavigate();

  const [state, setState] = useState<{
    ready: boolean;
    token: string | null;
    user: User | null;
  }>({
    ready: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    const sync = () => {
      const token = getToken();
      const user = getStoredUser();
      setState({ ready: true, token, user });
      if (requireAuth && (!token || !user)) {
        navigate("/login", { replace: true });
      }
    };

    sync();
    return subscribeSession(sync);
  }, [requireAuth, navigate]);

  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return {
    ready: state.ready,
    token: state.token,
    user: state.user,
    logout,
  };
}
