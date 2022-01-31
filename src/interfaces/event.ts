import { DisTubeEvents, Playlist, Queue, Song } from 'distube';
import {
  Awaitable,
  CommandInteraction,
  GuildTextBasedChannel,
} from 'discord.js';
import Client from '../entities/client';

export interface ExecuteFunction {
  (client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface DistubeExecuteFunction {
  (client: Client, ...args: DistubeArgs): Awaitable<void>;
}

export type DistubeArgs =
  | [Queue]
  | [Queue, Song]
  | [Queue, Playlist]
  | [GuildTextBasedChannel, Error];

export interface Event {
  name: string;
  once?: boolean;
  execute: ExecuteFunction;
}

export interface DistubeEvent {
  name: keyof DisTubeEvents;
  execute: DistubeExecuteFunction;
}
