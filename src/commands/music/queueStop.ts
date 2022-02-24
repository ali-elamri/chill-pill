import { ButtonInteraction } from 'discord.js';
import { Queue } from 'distube';
import {
  ButtonCommand,
  CommandCategory,
  CommandType,
  ButtonCommandExecuteFunction,
} from '../../interfaces/command';
import Client from '../../entities/client';

const execute: ButtonCommandExecuteFunction = async (
  client: Client,
  interaction: ButtonInteraction,
) => {
  const queue = client.distube.getQueue(interaction) as Queue;

  if (queue && !queue.paused && !queue.stopped) {
    queue.stop();
    client.setQueue(queue);
    client.emit('updateQueueMessage', client);
  }

  interaction.deferUpdate();
};

const command: ButtonCommand = {
  name: 'queueStop',
  commandType: CommandType.button,
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.music,
  description: 'Stop the queue.',
  usage: 'Button click on queue.',
  execute,
};

export default command;
