import { CommandInteraction } from 'discord.js';
import Client from '../../entities/client';
import {
  Command,
  CommandCategory,
  CommandType,
  ExecuteFunction,
} from '../../interfaces/command';

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  console.log(client);
};

const command: Command = {
  name: 'queuePause',
  interactionType: CommandType.button,
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.music,
  description: 'Play the next song on the queue.',
  usage: 'Button click on queue.',
  execute,
};

export default command;
