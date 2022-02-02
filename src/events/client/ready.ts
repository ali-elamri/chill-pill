// import { promisify } from 'util';
import Logger from '../../entities/logger';
import {
  ClientEvent,
  EventExecuteFunction,
  EventType,
} from '../../interfaces/event';
// import TodoService from '../../services/todoService';
// import todosJSON from '../../data/todos.json';
// import { TodoCategory } from '../../interfaces/todo';

// const wait = promisify(setTimeout);

const execute: EventExecuteFunction = async (client) => {
  client.user?.setActivity('Chilling... 💊');
  Logger.info('💊 Chill Pill is ready!');
  client.registerGuildCommands();

  // Left here for temporary manual seeding of todos
  // todosJSON.forEach(async (todo) => {
  //   TodoService.save(
  //     todo.name,
  //     todo.category as TodoCategory,
  //     todo.description,
  //     todo.author,
  //     todo.done,
  //   );
  //   await wait(500);
  // });
};

export default {
  name: 'ready',
  eventType: EventType.client,
  once: true,
  execute,
} as ClientEvent;
