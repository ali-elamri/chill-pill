import { CommandInteraction } from 'discord.js';
import Client from '../../entities/client';
import { Command } from '../../interfaces/command';
import { Event, ExecuteFunction } from '../../interfaces/event';

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  if (!interaction.isCommand()) return;

  if (!interaction.guild) return;

  const command: Command = client.commands.get(interaction.commandName)!;

  if (command) {
    await command.execute(client, interaction);
  } else {
    interaction.reply({
      embeds: [
        client.embed(
          {
            title: '❌ Error...',
            description: 'Seems like the command does not exist...',
          },
          interaction,
        ),
      ],
      ephemeral: true,
    });
  }
};

export default {
  name: 'interactionCreate',
  execute,
} as Event;
