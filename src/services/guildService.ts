import { doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { createCollection } from "../entities/firebase";
import { Guild } from "../interfaces/guild";

abstract class GuildService {
  public static colRef = createCollection<Guild>("guilds");

  /**
   * Creates new or updates document if exists
   *
   * @param id
   * @param name
   */
  public static async save(id: string, name: string) {
    const docRef = doc(this.colRef, id);

    await setDoc(
      docRef,
      {
        id,
        name,
      },
      { merge: true }
    );
  }

  /**
   * Fetches all documents
   *
   * @returns
   */
  public static async all(): Promise<Guild[]> {
    const q = query(this.colRef);
    const qSnap = await getDocs(q);
    const guilds: Guild[] = [];

    qSnap.forEach((snap) => {
      guilds.push(snap.data());
    });

    return guilds;
  }

  /**
   * Fetches a document based on id
   *
   * @param id
   * @returns
   */
  public static async find(id: string): Promise<Guild | null> {
    const docRef = doc(this.colRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as Guild;
  }
}

export default GuildService;
