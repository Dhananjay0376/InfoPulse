import { useCallback, useEffect, useState } from "react";

import {
  createUser,
  listUsers,
  resetUserPassword,
  updateUser,
  type ManagedUserInput,
  type ManagedUserPayload,
  type ManagedUserUpdateInput,
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

  const addUser = useCallback(
    async (input: ManagedUserInput) => {
      if (!token || !enabled) return;
      const response = await createUser(token, input);
      setUsers((prev) => [response.user, ...prev]);
      return response.user;
    },
    [token, enabled]
  );

  const updateManagedUser = useCallback(
    async (userId: string, input: ManagedUserUpdateInput) => {
      if (!token || !enabled) return;
      const response = await updateUser(token, userId, input);
      setUsers((prev) => prev.map((user) => (user.id === userId ? response.user : user)));
      return response.user;
    },
    [token, enabled]
  );

  const resetManagedUserPassword = useCallback(
    async (userId: string, password: string) => {
      if (!token || !enabled) return;
      const response = await resetUserPassword(token, userId, password);
      setUsers((prev) => prev.map((user) => (user.id === userId ? response.user : user)));
      return response.user;
    },
    [token, enabled]
  );

  return {
    users,
    loading,
    error,
    refreshUsers,
    addUser,
    updateManagedUser,
    resetManagedUserPassword,
  };
}
