import { Queue } from 'distube';
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

  let queueMessage = null;
  const options = queueMessageBuilder(client, queue);

  if (!client.queueState.message) {
    queueMessage = await queue.textChannel?.send(options);
  } else {
    queueMessage = await client.queueState.message.edit(options);
  }

  client.setQueueMessage(queueMessage as Message);
};

export default {
  name: 'updateQueueMessage',
  eventType: EventType.custom,
  execute,
} as CustomEvent;
