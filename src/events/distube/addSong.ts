import { Queue, RepeatMode } from 'distube';
import {
  DistubeEvent,
  DistubeEventExecuteFunction,
  EventType,
} from '../../interfaces/event';

const execute: DistubeEventExecuteFunction = async (client, ...args) => {
  const queue: Queue = args[0] as Queue;

  // TODO: Refactor this and set them at a higher level to avoid multiple triggers
  if (queue.repeatMode !== RepeatMode.QUEUE) {
    client.distube.setRepeatMode(queue, RepeatMode.QUEUE);
  }
  if (!queue.autoplay) {
    client.distube.toggleAutoplay(queue);
  }
  // TODO: end refactor---

  client.setQueue(queue);
  client.setQueueIsPlating(true);

  client.emit('updateQueueMessage', client);
};

export default {
  name: 'addSong',
  eventType: EventType.distube,
  execute,
} as DistubeEvent;
