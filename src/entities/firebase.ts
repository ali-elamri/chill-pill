import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';
import { config } from './config';

export const firebaseApp = initializeApp(config.firebase);

export const firestore = getFirestore();

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};
