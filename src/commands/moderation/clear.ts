import {
  ChannelLogsQueryOptions,
  Collection,
  CommandInteraction,
  GuildMember,
  Message,
  MessageEmbed,
  TextBasedChannel,
  TextChannel,
} from 'discord.js';
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
  const { channel, options } = interaction;

  if (!(channel instanceof TextChannel)) {
    return;
  }

  // const getMessages = async (
  //   chan: TextChannel,
  //   limit: number = 100,
  // ): Promise<Message[]> => {
  //   const out: Message[] = [];
  //   if (limit <= 100) {
  //     const messages: Collection<string, Message> = await chan.messages.fetch({
  //       limit,
  //     });
  //     const messagesArray = Array.from(messages.values());
  //     out.push(...messagesArray);
  //   } else {
  //     const rounds = limit / 100 + (limit % 100 ? 1 : 0);
  //     let lastId: string = '';
  //     for (let x = 0; x < rounds; x++) {
  //       const opts: ChannelLogsQueryOptions = {
  //         limit: 100,
  //       };
  //       if (lastId.length > 0) {
  //         opts.before = lastId;
  //       }
  //       // eslint-disable-next-line no-await-in-loop
  //       const messages: Collection<string, Message> = await chan.messages.fetch(
  //         opts,
  //       );
  //       const messagesArray = Array.from(messages.values());
  //       out.push(...messagesArray);
  //       lastId = messagesArray[messagesArray.length - 1].id as string;
  //     }
  //   }
  //   return out;
  // };

  const limit = options.getNumber('limit', true);
  const target = options.getMember('user') as GuildMember;
  // const channelMessages = await getMessages(channel, limit);
  const channelMessages = await channel.messages.fetch();

  const response = new MessageEmbed().setColor('LUMINOUS_VIVID_PINK');

  if (target) {
    const targetMessages = channelMessages.filter((message) => {
      return message.author.id === target.id;
    });

    channel.bulkDelete(targetMessages, true).then((messages) => {
      response.setDescription(
        `🗑 Cleared ${messages.size} messages from ${target}`,
      );
      interaction.reply({ embeds: [response], ephemeral: command.ephemeral });
    });
  } else {
    channel.bulkDelete(limit, true).then((messages) => {
      response.setDescription(`🗑 Cleared ${messages.size} messages.`);
      interaction.reply({ embeds: [response], ephemeral: command.ephemeral });
    });
  }
};

const command: Command = {
  name: 'clear',
  aliases: [],
  options: [
    {
      name: 'limit',
      type: 'NUMBER',
      required: true,
      description: 'Specify the number of messages to be deleted',
    },
    {
      name: 'user',
      type: 'USER',
      description:
        'Specify the user for which messages are going to be deleted.',
    },
  ],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.moderation,
  description: 'Deletes a number of messages within a channel or from a user.',
  usage: '/clear',
  execute,
};

export default command;
