import { Queue, Song } from 'distube';
import { Message } from 'discord.js';
import {
  CustomEvent,
  CustomEventExecuteFunction,
  EventType,
} from '../../interfaces/event';
import Client from '../../entities/client';
import queueMessageBuilder from '../../helpers/distube/queueMessageBuilder';

const execute: CustomEventExecuteFunction = async (...args: unknown[]) => {
  const client: Client = args[0] as Client;
  const queue: Queue = args[1] as Queue;
  const song: Song = args[2] as Song;

  console.log('refreshed Q');
  let queueMessage = null;
  const options = queueMessageBuilder(client, queue, song);

  if (!client.queueMessage) {
    console.log('new Q message');
    queueMessage = await queue.textChannel?.send(options);
  } else {
    console.log('Q message updated');
    queueMessage = await client.queueMessage.edit(options);
  }
  client.setQueueMessage(queueMessage as Message);
};

export default {
  name: 'refreshQueue',
  eventType: EventType.custom,
  execute,
} as CustomEvent;
