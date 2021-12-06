import { doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { createCollection } from '../entities/firebase';
import { Todo } from '../interfaces/todo';

abstract class TodoService {
  public static colRef = createCollection<Todo>('todos');

  /**
   * Creates new or updates document if exists
   *
   * @param id
   * @param name
   */
  public static async save(name: string, category: string, done: boolean) {
    const docRef = doc(this.colRef);

    await setDoc(
      docRef,
      {
        name,
        category,
        done,
      },
      { merge: true },
    );
  }

  /**
   * Fetches all documents
   *
   * @returns
   */
  public static async all(): Promise<Todo[]> {
    const q = query(this.colRef);
    const qSnap = await getDocs(q);
    const todos: Todo[] = [];

    qSnap.forEach((snap) => {
      todos.push(snap.data());
    });

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
}

export default TodoService;
