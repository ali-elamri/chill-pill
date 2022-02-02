import { ButtonInteraction, Guild, GuildMember } from 'discord.js';
import { Queue } from 'distube';
import {
  ButtonCommand,
  CommandCategory,
  CommandType,
  ButtonCommandExecuteFunction,
} from '../../interfaces/command';
import Client from '../../entities/client';
import autoJoin from '../../helpers/distube/autoJoin';

const execute: ButtonCommandExecuteFunction = async (
  client: Client,
  interaction: ButtonInteraction,
) => {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild as Guild;
  const queue = client.distube.getQueue(interaction) as Queue;

  await autoJoin(client, guild, member);

  if (queue && !queue.stopped) {
    const { pagination } = client.queueState;

    if (pagination.currentPage < pagination.totalPages) {
      client.setQueuePagination({
        ...pagination,
        ...{ currentPage: pagination.currentPage + 1 },
      });

      client.emit('updateQueueMessage', client, queue);
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
