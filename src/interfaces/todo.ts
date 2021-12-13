export interface Todo {
  name: string;
  description: string;
  category: TodoCategory;
  done: boolean;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface TodoGrouping {
  grouping: string;
  name: string;
  todos: Todo[];
  count: number;
}

export enum TodoCategory {
  structure = 'structure',
  features = 'features',
  commands = 'commands',
  events = 'events',
}
