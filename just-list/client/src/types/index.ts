export type ListKind = 'todo' | 'travel' | 'shopping';

export interface User {
  id: number;
  name: string;
}

export interface TaskBucket {
  active: string[];
  completed: string[];
}

export const LIST_META: Record<
  ListKind,
  { title: string; path: string; description: string }
> = {
  todo: {
    title: 'To-Do Tasks',
    path: '/todo',
    description: 'Lists all your tasks and lets us remember them for you',
  },
  travel: {
    title: 'Travel-Mate',
    path: '/travel',
    description: 'Places to visit and packing lists for your trips',
  },
  shopping: {
    title: 'Shopping List',
    path: '/shopping',
    description: 'Save items to buy so you do not forget them at the store',
  },
};
