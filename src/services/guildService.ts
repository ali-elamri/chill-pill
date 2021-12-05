import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore, createCollection } from "../entities/firebase";
import Logger from "../entities/logger";
import { Guild } from "../interfaces/guild";

abstract class GuildService {
  public static guildsCollection = createCollection<Guild>("guilds");

  /**
   * Creates new or updates document if exists
   *
   * @param id
   * @param name
   */
  public static async save(id: string, name: string) {
    const guildsRef = doc(this.guildsCollection, id);

    await setDoc(
      guildsRef,
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
    const q = query(this.guildsCollection);
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
    const docRef = doc(this.guildsCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as Guild;
  }
}

export default GuildService;
