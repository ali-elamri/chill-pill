import { Queue } from 'distube';
import {
  DistubeEvent,
  DistubeEventExecuteFunction,
} from '../../interfaces/event';

const execute: DistubeEventExecuteFunction = async (client, ...args) => {};

export default {
  name: 'disconnect',
  execute,
} as DistubeEvent;
