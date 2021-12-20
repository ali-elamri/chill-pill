import { ApplicationCommandOption, CommandInteraction } from 'discord.js';
import Client from '../entities/client';

export enum CommandCategory {
  admin = 'Admin Command',
  info = 'Information Command',
  config = 'Configuration Command',
}

export interface ExecuteFunction {
  (client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface Command {
  name: string;
  category: CommandCategory;
  description: string;
  usage: string;
  aliases?: string[];
  options?: ApplicationCommandOption[];
  ephemeral?: boolean;
  cooldown?: number;
  execute: ExecuteFunction;
}
