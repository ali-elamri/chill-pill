import { MessageEmbed } from 'discord.js';
import { Queue, RepeatMode, Song } from 'distube';
import { join } from 'lodash';
import { DistubeEvent, DistubeExecuteFunction } from '../../interfaces/event';

const execute: DistubeExecuteFunction = async (client, ...args) => {
  const queue: Queue = args[0] as Queue;
  const song: Song = args[1] as Song;

  if (queue.repeatMode !== RepeatMode.QUEUE) {
    client.distube.setRepeatMode(queue, RepeatMode.QUEUE);
  }

  const formatQueue = (q: Queue, s: Song) => {
    const queueList: string[] = q.songs.map((item, id) => {
      return `${id + 1} - ${item.name} | \`${item.formattedDuration}\``;
    });

    return join(queueList, '\n');
  };
  const embed: MessageEmbed = new MessageEmbed()
    .setColor('LUMINOUS_VIVID_PINK')
    .setTitle(
      `🎶 Jukebox is ON! \u3000\u3000\u3000 ${queue.songs.length} songs | ${queue.formattedDuration}`,
    )
    .setURL('https://chillpill.io/jukebox')
    .setAuthor({
      name: 'Chill Pill',
      iconURL: client.user?.displayAvatarURL({
        dynamic: true,
        format: 'png',
      }),
      url: 'https://chillpill.io',
    })
    .setDescription('Some description here')
    .setImage(song.thumbnail as string)
    .addField('Queue', formatQueue(queue, song))
    .addField('Currently playing', `${song.name}`)
    .addFields(
      { name: 'Requester', value: `<@${song.user!.id}>`, inline: true },
      { name: 'Views', value: `${song.views.toLocaleString()}`, inline: true },
      { name: 'Views', value: `${song.likes.toLocaleString()}`, inline: true },
    )
    .setTimestamp()
    .setFooter({
      text: `💊 Chill Pill ${'\u3000'.repeat(10)}`,
      iconURL: client.user?.displayAvatarURL({
        dynamic: true,
        format: 'png',
      }),
    });

  await queue.textChannel?.send({
    embeds: [embed],
  });
};

export default {
  name: 'playSong',
  execute,
} as DistubeEvent;
