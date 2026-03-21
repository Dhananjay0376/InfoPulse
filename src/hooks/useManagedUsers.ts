import { useCallback, useEffect, useState } from "react";

import {
  createUser,
  listUsers,
  type ManagedUserInput,
  type ManagedUserPayload,
} from "../lib/api";

export function useManagedUsers(token: string | null, enabled: boolean) {
  const [users, setUsers] = useState<ManagedUserPayload[]>([]);
  const [loading, setLoading] = useState(Boolean(token && enabled));
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    if (!token || !enabled) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await listUsers(token);
      setUsers(response.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  const addUser = useCallback(async (input: ManagedUserInput) => {
    if (!token || !enabled) return;
    const response = await createUser(token, input);
    setUsers((prev) => [response.user, ...prev]);
    return response.user;
  }, [token, enabled]);

  return {
    users,
    loading,
    error,
    refreshUsers,
    addUser,
  };
}
