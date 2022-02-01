import { Queue } from 'distube';
import { DistubeEvent, DistubeExecuteFunction } from '../../interfaces/event';

const execute: DistubeExecuteFunction = async (client, ...args) => {};

export default {
  name: 'disconnect',
  execute,
} as DistubeEvent;
