import { CommandInteraction, Message } from 'discord.js';
import { promisify } from 'util';
import Client from '../../entities/client';
import {
  Command,
  CommandCategory,
  CommandType,
  ExecuteFunction,
} from '../../interfaces/command';

const wait = promisify(setTimeout);

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  const message = await interaction.reply({
    embeds: [
      client.embed(
        {
          title: '⏳ Pinging...',
          description: 'We will get you a response shortly...',
        },
        interaction,
      ),
    ],
    ephemeral: command.ephemeral,
    fetchReply: true,
  });

  if (!command.ephemeral && message instanceof Message) {
    await message.react('🇵');
    await message.react('🇮');
    await message.react('🇳');
    await message.react('🇬');
    await message.react('💊');
  } else {
    await wait(1000);
  }

  await interaction.editReply({
    embeds: [
      client.embed(
        {
          title: ":white_check_mark: It's alive!",
          description: 'There you go!',
        },
        interaction,
      ),
    ],
  });
};

const command: Command = {
  name: 'ping',
  interactionType: CommandType.command,
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.info,
  description: 'Pings you back... duh!',
  usage: '/ping',
  execute,
};

export default command;
