import Logger from '../../entities/logger';
import { Event, ExecuteFunction } from '../../interfaces/event';

const execute: ExecuteFunction = async (client) => {
  client.user?.setActivity('Chilling... 💊');
  Logger.info('💊 Chill Pill is ready!');
  client.registerGuildCommands();
};

export default {
  name: 'ready',
  once: true,
  execute,
} as Event;
