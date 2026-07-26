export type ListKind = 'todo' | 'travel' | 'shopping';

export interface User {
  id: number;
  name: string;
}

export interface TaskBucket {
  active: string[];
  completed: string[];
}

export type UserLists = Record<string, TaskBucket>;

export interface ListsData {
  todo: UserLists;
  travel: UserLists;
  shopping: UserLists;
}

export interface UsersData {
  users: User[];
}

export const LIST_KINDS: ListKind[] = ['todo', 'travel', 'shopping'];

export function emptyBucket(): TaskBucket {
  return { active: [], completed: [] };
}
