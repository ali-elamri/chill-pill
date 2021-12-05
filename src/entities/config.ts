import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

const parseServers = (server_ids: string): string[] => {
  let servers: string[] = [];

  server_ids.split(",").map((server_id) => {
    if (server_id) servers.push(server_id.trim());
  });

  return servers;
};

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Config {
  client_token: string;
  guilds: string[];
  firebase: FirebaseConfig;
}

export const config = {
  client_token: process.env.CLIENT_TOKEN!,
  guilds: parseServers(process.env.SERVER_IDS!),
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
} as Config;
