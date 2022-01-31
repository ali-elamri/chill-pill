import {
  BaseGuildTextChannel,
  CommandInteraction,
  GuildMember,
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

  try {
    switch (options.getSubcommand()) {
      case 'play': {
        client.distube.play(voiceChannel, options.getString('song'), {
          member,
          textChannel: channel,
        });
        return await interaction.reply({
          content: 'Playing now!',
          ephemeral: true,
        });
      }
      case 'volume': {
        const volume = options.getNumber('volume', true);
        if (volume > 100 || volume < 0) {
          return await interaction.reply({
            content: 'Volume must be a number between 0 and 100!',
            ephemeral: true,
          });
        }

        client.distube.setVolume(voiceChannel, volume);

        return await interaction.reply({
          content: `Volume has been set to ${volume}%`,
          ephemeral: true,
        });
      }
      case 'skip': {
        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
          return await interaction.reply({
            content: 'The queue is empty!',
            ephemeral: true,
          });
        }

        await queue.skip();
        return await interaction.reply({
          content: 'You skipped the current song!',
          ephemeral: true,
        });
      }
      case 'stop': {
        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
          return await interaction.reply({
            content: 'The queue is empty!',
            ephemeral: true,
          });
        }

        await queue.stop();
        return await interaction.reply({
          content: 'You stopped the current queue!',
          ephemeral: true,
        });
      }
      case 'pause': {
        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
          return await interaction.reply({
            content: 'The queue is empty!',
            ephemeral: true,
          });
        }

        await queue.pause();
        return await interaction.reply({
          content: 'You paused the current queue!',
          ephemeral: true,
        });
      }
      case 'resume': {
        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
          return await interaction.reply({
            content: 'The queue is empty!',
            ephemeral: true,
          });
        }

        await queue.resume();
        return await interaction.reply({
          content: 'You resumed the current queue!',
          ephemeral: true,
        });
      }
      case 'queue': {
        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
          return await interaction.reply({
            content: 'The queue is empty!',
            ephemeral: true,
          });
        }

        return await interaction.reply({
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
      default: {
        return await interaction.reply({
          content: 'Huh?.',
          ephemeral: true,
        });
      }
    }
  } catch (error) {
    return interaction.reply({
      embeds: [
        client.embed(
          {
            title: '❌ Something went wrong...',
            description: JSON.stringify(error),
          },
          interaction,
        ),
      ],
      ephemeral: command.ephemeral,
    });
  }
};

const command: Command = {
  name: 'music',
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
      name: 'volume',
      type: 'SUB_COMMAND',
      description: 'Conrols the bot volume.',
      options: [
        {
          name: 'percentage',
          type: 'NUMBER',
          description: "A percentage (%), the bot's music volume (100 = 100%)",
          required: true,
        },
      ],
    },
    {
      name: 'queue',
      type: 'SUB_COMMAND',
      description: 'Get queue information.',
    },
    {
      name: 'skip',
      type: 'SUB_COMMAND',
      description: 'Skips the current song.',
    },
    {
      name: 'pause',
      type: 'SUB_COMMAND',
      description: 'Pauses the current song.',
    },
    {
      name: 'resume',
      type: 'SUB_COMMAND',
      description: 'Resumes playing the queue.',
    },
    {
      name: 'stop',
      type: 'SUB_COMMAND',
      description: 'Stops playing the queue.',
    },
    {
      name: 'clear',
      type: 'SUB_COMMAND',
      description: 'Clears the current queue.',
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
