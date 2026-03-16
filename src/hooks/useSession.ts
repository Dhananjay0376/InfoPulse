import { useEffect, useState } from "react";

import { getCurrentUser, login, type AuthUser } from "../lib/api";

const TOKEN_KEY = "infopulse_access_token";
const USER_KEY = "infopulse_user";

export function useSession() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void getCurrentUser(token)
      .then(({ user: currentUser }) => {
        if (cancelled) return;
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function signIn(email: string, password: string) {
    setError(null);

    try {
      const session = await login(email, password);
      setToken(session.token);
      setUser(session.user);
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  }

  function signOut() {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    token,
    user,
    loading,
    error,
    setError,
    signIn,
    signOut,
    isAuthenticated: Boolean(token && user),
  };
}
