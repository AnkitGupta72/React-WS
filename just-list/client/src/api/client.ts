import type { ListKind, TaskBucket, User } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export function fetchUsers(): Promise<{ users: User[] }> {
  return request('/users');
}

export function createUser(name: string): Promise<{ user: User }> {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function fetchList(
  kind: ListKind,
  userId: number,
): Promise<{ kind: ListKind; userId: number; bucket: TaskBucket }> {
  return request(`/lists/${kind}?userId=${userId}`);
}

export function saveList(
  kind: ListKind,
  userId: number,
  bucket: TaskBucket,
): Promise<{ kind: ListKind; userId: number; bucket: TaskBucket }> {
  return request(`/lists/${kind}`, {
    method: 'PUT',
    body: JSON.stringify({ userId, bucket }),
  });
}
