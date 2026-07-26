import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as api from '../api/client';
import type { User } from '../types';

interface UserContextValue {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  selectUser: (user: User) => void;
  createUser: (name: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setError(null);
    try {
      const { users: next } = await api.fetchUsers();
      setUsers(next);
      setSelectedUser((prev) => {
        if (prev && next.some((u) => u.id === prev.id)) {
          return next.find((u) => u.id === prev.id) ?? null;
        }
        return next[0] ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  const selectUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const createUser = useCallback(async (name: string) => {
    const { user } = await api.createUser(name);
    setUsers((prev) => [...prev, user]);
    setSelectedUser(user);
  }, []);

  const value = useMemo(
    () => ({
      users,
      selectedUser,
      loading,
      error,
      selectUser,
      createUser,
      refreshUsers,
    }),
    [users, selectedUser, loading, error, selectUser, createUser, refreshUsers],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
