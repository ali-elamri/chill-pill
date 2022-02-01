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

export interface ExecuteFunction {
  (client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface ButtonExecuteFunction {
  (client: Client, interaction: ButtonInteraction): Promise<void>;
}

export interface Command {
  name: string;
  interactionType: CommandType;
  category: CommandCategory;
  description: string;
  usage: string;
  aliases?: string[];
  options?: ApplicationCommandOption[];
  ephemeral?: boolean;
  cooldown?: number;
  execute: ExecuteFunction;
}

export interface Button extends Omit<Command, 'execute'> {
  execute: ButtonExecuteFunction;
}
