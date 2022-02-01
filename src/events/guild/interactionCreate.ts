import { ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import Client from '../../entities/client';
import { Command } from '../../interfaces/command';
import { Event, ExecuteFunction } from '../../interfaces/event';

const execute: ExecuteFunction = async (
  client: Client,
  interaction: Interaction,
) => {
  if (!interaction.guild) return;

  if (interaction.isButton()) {
    const buttonInteraction: ButtonInteraction = interaction;
    const command: Command = client.commands.get(
      buttonInteraction.customId,
    ) as Command;

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
    const command: Command = client.commands.get(
      interaction.commandName,
    ) as Command;

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
