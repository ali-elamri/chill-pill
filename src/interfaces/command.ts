import {
  ApplicationCommandOption,
  ButtonInteraction,
  CommandInteraction,
} from 'discord.js';
import Client from '../entities/client';

export enum CommandCategory {
  admin = 'Admin Command',
  info = 'Information Command',
  config = 'Configuration Command',
  music = 'Music Command',
  moderation = 'Moderation Command',
}

export enum CommandType {
  command,
  button,
}

export interface SlashCommandExecuteFunction {
  (client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface ButtonCommandExecuteFunction {
  (client: Client, interaction: ButtonInteraction): Promise<void>;
}

export interface Command {
  name: string;
  commandType: CommandType;
  category: CommandCategory;
  description: string;
  usage: string;
  aliases?: string[];
  options?: ApplicationCommandOption[];
  ephemeral?: boolean;
  cooldown?: number;
}

export interface SlashCommand extends Command {
  execute: SlashCommandExecuteFunction;
}

export interface ButtonCommand extends Command {
  execute: ButtonCommandExecuteFunction;
}
