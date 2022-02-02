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

export interface CustomEventExecuteFunction {
  (...args: unknown[]): Promise<void>;
}

export type DistubeArgs =
  | [Queue]
  | [Queue, Song]
  | [Queue, Playlist]
  | [GuildTextBasedChannel, Error];

export enum EventType {
  client,
  distube,
  custom,
}
export interface Event {
  name: string;
  once?: boolean;
  eventType: EventType;
}

export interface ClientEvent extends Event {
  execute: EventExecuteFunction;
}

export interface CustomEvent extends Event {
  execute: CustomEventExecuteFunction;
}
export interface DistubeEvent extends Omit<Event, 'name'> {
  name: keyof DisTubeEvents;
  execute: DistubeEventExecuteFunction;
}
