import dotenv from "dotenv";

dotenv.config();

const parseServers = (server_ids: string): string[] => {
  let servers: string[] = [];

  server_ids.split(",").map((server_id) => {
    servers.push(server_id.trim());
  });

  return servers;
};

export interface Config {
  client_token: string;
  servers: string[];
}

export const config: Config = {
  client_token: process.env.CLIENT_TOKEN!,
  servers: parseServers(process.env.SERVER_IDS!),
};
