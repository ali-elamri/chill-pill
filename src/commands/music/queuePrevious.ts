import { promisify } from 'util';
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

const wait = promisify(setTimeout);

const execute: ButtonCommandExecuteFunction = async (
  client: Client,
  interaction: ButtonInteraction,
) => {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild as Guild;
  const queue = client.distube.getQueue(interaction) as Queue;

  await autoJoin(client, guild, member);

  if (queue && !queue.stopped) {
    await queue.previous();
    client.setQueue(queue);
    await wait(1000);
    client.emit('updateQueueMessage', client);
  }

  interaction.deferUpdate();
};

const command: ButtonCommand = {
  name: 'queuePrevious',
  commandType: CommandType.button,
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.music,
  description: 'Play the previous song in the queue.',
  usage: 'Button click on queue.',
  execute,
};

export default command;
