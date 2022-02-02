import { Queue } from 'distube';
import {
  DistubeEvent,
  DistubeEventExecuteFunction,
  EventType,
} from '../../interfaces/event';

const execute: DistubeEventExecuteFunction = async (client, ...args) => {};

export default {
  name: 'disconnect',
  eventType: EventType.distube,
  execute,
} as DistubeEvent;
