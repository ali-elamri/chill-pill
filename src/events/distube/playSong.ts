import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Queue, RepeatMode, Song } from 'distube';
import { join } from 'lodash';
import {
  DistubeEvent,
  DistubeEventExecuteFunction,
} from '../../interfaces/event';

const execute: DistubeEventExecuteFunction = async (client, ...args) => {
  const queue: Queue = args[0] as Queue;
  const song: Song = args[1] as Song;

  if (queue.repeatMode !== RepeatMode.QUEUE) {
    client.distube.setRepeatMode(queue, RepeatMode.QUEUE);
  }
  if (!queue.autoplay) {
    client.distube.toggleAutoplay(queue);
  }

  client.setQueue(queue);

  const formatQueue = (q: Queue, s: Song) => {
    const queueSubset = q.songs.slice(0, 10);

    const queueList: string[] = queueSubset.map((item, id) => {
      return `**${id + 1}** - ${item.name} | \`${item.formattedDuration}\``;
    });

    return join(queueList, '\n');
  };

  const messageEmbed: MessageEmbed = new MessageEmbed()
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

  const firstActionsRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('queuePreviousPage')
      .setLabel('Previous Page')
      .setStyle('SECONDARY')
      .setDisabled(true),
    new MessageButton()
      .setCustomId('queueNextPage')
      .setLabel('Next Page')
      .setStyle('SECONDARY')
      .setDisabled(true),
  );

  const secondActionsRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('queuePrevious')
      .setLabel('Previous')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId('queueNext')
      .setLabel('Next')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId('queueShuffle')
      .setLabel('Shuffle')
      .setStyle('SECONDARY'),
  );

  const thirdActionsRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('queuePause')
      .setLabel('Pause')
      .setStyle('SUCCESS'),
    new MessageButton()
      .setCustomId('queueResume')
      .setLabel('Resume')
      .setStyle('SUCCESS'),
    new MessageButton()
      .setCustomId('queueStop')
      .setLabel('Stop')
      .setStyle('DANGER')
      .setDisabled(true),
  );

  await queue.textChannel?.send({
    embeds: [messageEmbed],
    components: [firstActionsRow, secondActionsRow, thirdActionsRow],
  });
};

export default {
  name: 'playSong',
  execute,
} as DistubeEvent;
