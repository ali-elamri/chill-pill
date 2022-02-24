import {
  BaseGuildTextChannel,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import Client from '../../entities/client';
import {
  SlashCommand,
  CommandCategory,
  CommandType,
  SlashCommandExecuteFunction,
} from '../../interfaces/command';

const execute: SlashCommandExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  const { guild, member, channel, options } = interaction;

  if (
    !guild ||
    !(member instanceof GuildMember) ||
    !(channel instanceof BaseGuildTextChannel)
  ) {
    throw new TypeError();
  }

  const voiceChannel = member.voice.channel;

  // Check if member is in a voice channel before playing music
  if (!voiceChannel) {
    return interaction.reply({
      content: 'You must be within a voice channel to run this command.',
      ephemeral: true,
    });
  }

  // Assess if bot is already playing music on a different channel.
  if (
    guild.me?.voice &&
    guild.me.voice.channelId &&
    guild.me.voice.channelId !== voiceChannel.id
  ) {
    return interaction.reply({
      content: `I'm already playing music on <#${guild.me.voice.channelId}>, come join me.`,
      ephemeral: true,
    });
  }

  const { queue } = client.queueState;

  const musicCommand: string = options.getSubcommand();

  if (musicCommand === 'play') {
    client.distube.play(voiceChannel, options.getString('song'), {
      member,
      textChannel: channel,
    });

    interaction.reply({
      content: 'Added your song to the queue!',
      ephemeral: command.ephemeral,
    });
  } else if (musicCommand === 'queue') {
    if (!queue) {
      return interaction.reply({
        content: 'The queue is empty!',
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        client.embed(
          {
            title: '⏳ Queue...',
            description: `${queue.songs.map((song, id) => {
              return `\n**${id + 1}** - ${song.name} - \`${
                song.formattedDuration
              }\``;
            })}`,
          },
          interaction,
        ),
      ],
      ephemeral: true,
    });
  }
};

const command: SlashCommand = {
  name: 'music',
  commandType: CommandType.command,
  aliases: [],
  options: [
    {
      name: 'play',
      type: 'SUB_COMMAND',
      description: 'Plays a song.',
      options: [
        {
          name: 'song',
          type: 'STRING',
          description: 'Link or name for the song to be played.',
          required: true,
        },
      ],
    },
    {
      name: 'jump',
      type: 'SUB_COMMAND',
      description: 'Jumps to a song in the queue.',
      options: [
        {
          name: 'position',
          type: 'NUMBER',
          description: "Song's position in the queue",
          required: true,
        },
      ],
    },
    {
      name: 'queue',
      type: 'SUB_COMMAND',
      description: 'Get queue information.',
    },
  ],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.music,
  description: 'A somewhat complete music system.',
  usage: '/music',
  execute,
};

export default command;
