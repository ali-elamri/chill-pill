import { Queue, Song } from 'distube';
import {
  DistubeEvent,
  DistubeEventExecuteFunction,
  EventType,
} from '../../interfaces/event';

// args = [queue, song]
const execute: DistubeEventExecuteFunction = async (client, ...args) => {
  const queue: Queue = args[0] as Queue;
  const song: Song = args[1] as Song;

  // // TODO: Refactor this and set them at a higher level to avoid multiple triggers
  // if (queue.repeatMode !== RepeatMode.QUEUE) {
  //   client.distube.setRepeatMode(queue, RepeatMode.QUEUE);
  // }
  // if (!queue.autoplay) {
  //   client.distube.toggleAutoplay(queue);
  // }

  // client.setQueue(queue);
  // TODO: end refactor---

  client.emit('refreshQueue', client, ...args);
};

export default {
  name: 'addSong',
  eventType: EventType.distube,
  execute,
} as DistubeEvent;
