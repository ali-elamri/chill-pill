import { CommandInteraction } from 'discord.js';
import Client from '../../entities/client';
import {
  SlashCommand,
  CommandCategory,
  CommandType,
  SlashCommandExecuteFunction,
} from '../../interfaces/command';

const execute: SlashCommandExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  console.log(client);
};

const command: SlashCommand = {
  name: 'queuePause',
  commandType: CommandType.button,
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
