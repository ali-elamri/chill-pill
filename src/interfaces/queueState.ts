import {
  Message,
  EmojiIdentifierResolvable,
  MessageButtonStyleResolvable,
} from 'discord.js';
import { Queue } from 'distube';

export interface QueueState {
  queue: Queue | null;
  pagination: QueuePagination;
  message: Message | null;
  buttonRows: ButtonRow[];
}

export type ButtonRow = QueueButton[];

export interface QueuePagination {
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface QueueButton {
  customId: string;
  label: string;
  emoji?: EmojiIdentifierResolvable;
  style: MessageButtonStyleResolvable;
  url?: string;
  disabled?: boolean;
}
