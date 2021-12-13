import { doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { chain } from 'lodash';
import moment from 'moment';
import { TodoGrouping, Todo, TodoCategory } from '../interfaces/todo';
import { createCollection } from '../entities/firebase';

abstract class TodoService {
  public static todos: Todo[];

  public static colRef = createCollection<Todo>('todos');

  /**
   * Creates new or updates document if exists
   *
   * @param id
   * @param name
   */
  public static async save(
    name: string,
    category: TodoCategory,
    description: string,
    author: string,
    done: boolean = false,
  ) {
    const docRef = doc(this.colRef);

    await setDoc(
      docRef,
      {
        name,
        category,
        description,
        done,
        author,
        created_at: moment().toISOString(),
        updated_at: moment().toISOString(),
      },
      { merge: true },
    );
  }

  /**
   * Fetches all documents
   *
   * @returns
   */
  public static async all({
    emojify = false,
    groupBy = 'category',
  }: {
    emojify?: boolean;
    groupBy?: string;
  }): Promise<unknown> {
    const q = query(this.colRef);
    const qSnap = await getDocs(q);
    let todos: Todo[] = [];

    qSnap.forEach((snap) => {
      todos.push(snap.data());
    });

    if (emojify) todos = this.emojifyTodos(todos);
    if (groupBy) return this.groupTodos(todos);
    return todos;
  }

  /**
   * Fetches a document based on id
   *
   * @param id
   * @returns
   */
  public static async find(id: string): Promise<Todo | null> {
    const docRef = doc(this.colRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as Todo;
  }

  public static emojifyTodo(todo: Todo) {
    const emoji = todo.done ? '✅' : '❌';
    return { ...todo, name: `${emoji} ${todo.name}` };
  }

  public static emojifyTodos(todos: Todo[]): Todo[] {
    return todos.map((todo: Todo) => {
      return this.emojifyTodo(todo);
    });
  }

  public static doneTodos(todos: Todo[]): Todo[] {
    return todos.filter((todo: Todo) => {
      return todo.done;
    });
  }

  public static undoneTodos(todos: Todo[]): Todo[] {
    return todos.filter((todo: Todo) => {
      return !todo.done;
    });
  }

  public static groupTodos(
    todos: Todo[],
    grouping: string = 'category',
  ): TodoGrouping[] {
    return chain(todos)
      .groupBy(grouping)
      .map((value: Todo[], key: string) => {
        return {
          grouping,
          name: key,
          count: value.length,
          todos: value,
        };
      })
      .value();
  }
}

export default TodoService;
