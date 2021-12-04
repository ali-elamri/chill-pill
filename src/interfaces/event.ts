import { CommandInteraction } from "discord.js";
import Client from "../entities/client";

export interface ExecuteFunction {
  (client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: ExecuteFunction;
}
