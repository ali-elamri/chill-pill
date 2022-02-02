import { ButtonInteraction, Guild, GuildMember } from 'discord.js';
import { Queue } from 'distube';
import { promisify } from 'util';
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

  if (queue && !queue.stopped && !queue.paused) {
    queue.seek(0);
    client.emit('updateQueueMessage', client, queue);
  }

  interaction.deferUpdate();
};

const command: ButtonCommand = {
  name: 'queueSeekReset',
  commandType: CommandType.button,
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.music,
  description: 'Replays the current song.',
  usage: 'Button click on queue.',
  execute,
};

export default command;
