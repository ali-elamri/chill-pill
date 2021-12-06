import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import Client from '../../entities/client';
import {
  Command,
  CommandCategory,
  ExecuteFunction,
} from '../../interfaces/command';

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  const option = interaction.options.get('command')?.value as string;
  const commandToHelpWith = client.commands
    .filter((command: Command) => {
      return command.category !== CommandCategory.admin;
    })
    .get(option?.toLowerCase());

  let messageEmbed: MessageEmbed;
  if (!commandToHelpWith) {
    const fields: Array<EmbedFieldData> = [...client.categories]
      .filter((category: string) => {
        return category !== CommandCategory.admin;
      })
      .map((category: string) => {
        const commandCount = client.commands.filter((command: Command) => {
          return command.category === category;
        }).size;

        return {
          name: `${category} [${commandCount}]`,
          value: client.commands
            .filter((command: Command) => {
              return command.category === category;
            })
            .map((command: Command) => {
              return `\`/${command.name}\``;
            })
            .join(', '),
        };
      });

    messageEmbed = client.embed(
      {
        title: `**${client.user?.username}** offers **${
          client.commands.filter((value: Command) => {
            return value.category !== CommandCategory.admin;
          }).size
        }** commands!`,
        url: 'https://github.com/Shoodey/chill-pill',
        fields,
        description:
          'Feel like coming up with additional ones? Feel free to contibute to the [GitHub repo](https://github.com/Shoodey/chill-pill) and star it!',
      },
      interaction,
    );

    return interaction.reply({
      embeds: [messageEmbed],
      ephemeral: command.ephemeral,
    });
  }

  const aliases =
    commandToHelpWith.aliases && commandToHelpWith.aliases.length
      ? commandToHelpWith.aliases.join(',')
      : 'none';

  messageEmbed = client.embed(
    {
      title: `Help on \`/${commandToHelpWith.name}\``,
      fields: [
        {
          name: 'Please note...',
          value: 'Options: ?:optional !:required <...>:type',
          inline: true,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/indent
      description: `
           **Name:** \`${commandToHelpWith.name}\`
           **Aliases:** \`${aliases}\`
           **Category:** \`${commandToHelpWith.category}\`
           **Description:** \`${commandToHelpWith.description}\`
           **Usage:** \`${commandToHelpWith.usage}\`
           **Cooldown:** \`${commandToHelpWith.cooldown}s\`
        `,
    },
    interaction,
  );

  return interaction.reply({
    embeds: [messageEmbed],
    ephemeral: command.ephemeral,
  });
};

const command: Command = {
  name: 'help',
  aliases: [],
  options: [
    {
      name: 'command',
      type: 'STRING',
      description: 'Get additional information for the command.',
    },
  ],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.info,
  description: 'Lists available useful (or not) commands.',
  usage: '/help ?command',
  execute,
};

export default command;
