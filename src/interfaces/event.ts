import { DisTubeEvents, Playlist, Queue, Song } from 'distube';
import {
  Awaitable,
  CommandInteraction,
  GuildTextBasedChannel,
} from 'discord.js';
import Client from '../entities/client';

export interface EventExecuteFunction {
  (client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface DistubeEventExecuteFunction {
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
  execute: EventExecuteFunction;
}

export interface DistubeEvent {
  name: keyof DisTubeEvents;
  execute: DistubeEventExecuteFunction;
}
