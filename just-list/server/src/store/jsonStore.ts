import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  emptyBucket,
  type ListKind,
  type ListsData,
  type TaskBucket,
  type User,
  type UsersData,
} from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.resolve(__dirname, '../../data');

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LISTS_FILE = path.join(DATA_DIR, 'lists.json');

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      await writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8');
      return structuredClone(fallback);
    }
    throw err;
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDataDir();
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

const defaultUsers: UsersData = { users: [] };
const defaultLists: ListsData = { todo: {}, travel: {}, shopping: {} };

export async function getUsers(): Promise<User[]> {
  await ensureDataDir();
  const data = await readJson<UsersData>(USERS_FILE, defaultUsers);
  return data.users;
}

export async function addUser(name: string): Promise<User> {
  await ensureDataDir();
  const data = await readJson<UsersData>(USERS_FILE, defaultUsers);
  const nextId =
    data.users.reduce((max, u) => (u.id > max ? u.id : max), 0) + 1;
  const user: User = { id: nextId, name };
  data.users.push(user);
  await writeJson(USERS_FILE, data);

  const lists = await readJson<ListsData>(LISTS_FILE, defaultLists);
  for (const kind of Object.keys(lists) as ListKind[]) {
    lists[kind][String(user.id)] = emptyBucket();
  }
  await writeJson(LISTS_FILE, lists);

  return user;
}

export async function getListForUser(
  kind: ListKind,
  userId: number,
): Promise<TaskBucket> {
  await ensureDataDir();
  const lists = await readJson<ListsData>(LISTS_FILE, defaultLists);
  const key = String(userId);
  if (!lists[kind][key]) {
    lists[kind][key] = emptyBucket();
    await writeJson(LISTS_FILE, lists);
  }
  return lists[kind][key];
}

export async function setListForUser(
  kind: ListKind,
  userId: number,
  bucket: TaskBucket,
): Promise<TaskBucket> {
  await ensureDataDir();
  const users = await getUsers();
  if (!users.some((u) => u.id === userId)) {
    const error = new Error('User not found') as Error & { status: number };
    error.status = 404;
    throw error;
  }

  const lists = await readJson<ListsData>(LISTS_FILE, defaultLists);
  lists[kind][String(userId)] = {
    active: [...bucket.active],
    completed: [...bucket.completed],
  };
  await writeJson(LISTS_FILE, lists);
  return lists[kind][String(userId)];
}
