import { Queue } from 'distube';
import {
  DistubeEvent,
  DistubeEventExecuteFunction,
  EventType,
} from '../../interfaces/event';

const execute: DistubeEventExecuteFunction = async (client, ...args) => {
  const queue = args[0] as Queue;

  console.log(client.queueState);

  client.emit('updateQueueMessage', client, queue);
};

export default {
  name: 'disconnect',
  eventType: EventType.distube,
  execute,
} as DistubeEvent;
