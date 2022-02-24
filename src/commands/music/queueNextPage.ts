import { ButtonInteraction } from 'discord.js';
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
  const { queue } = client.queueState;

  if (queue && !queue.stopped) {
    const { pagination } = client.queueState;

    if (pagination.currentPage < pagination.totalPages) {
      client.setQueuePagination({
        ...pagination,
        ...{ currentPage: pagination.currentPage + 1 },
      });

      client.emit('updateQueueMessage', client);
    }
  }

  interaction.deferUpdate();
};

const command: ButtonCommand = {
  name: 'queueNextPage',
  commandType: CommandType.button,
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.music,
  description: 'Display the next page in the queue list',
  usage: 'Button click on queue.',
  execute,
};

export default command;
