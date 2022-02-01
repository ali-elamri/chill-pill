import { Interaction } from 'discord.js';
import { ButtonCommand, SlashCommand } from '../../interfaces/command';
import Client from '../../entities/client';
import { Event, EventExecuteFunction } from '../../interfaces/event';

const execute: EventExecuteFunction = async (
  client: Client,
  interaction: Interaction,
) => {
  if (!interaction.guild) return;

  if (interaction.isButton()) {
    const command: ButtonCommand = client.commands.get(
      interaction.customId,
    ) as ButtonCommand;

    if (command) {
      await command.execute(client, interaction);
    } else {
      interaction.reply({
        content: 'An error has occured.',
        ephemeral: true,
      });
    }

    // handlebuttonInteraction(client, interaction);
  }

  if (interaction.isCommand()) {
    const command: SlashCommand = client.commands.get(
      interaction.commandName,
    ) as SlashCommand;

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
  }
};

export default {
  name: 'interactionCreate',
  execute,
} as Event;
