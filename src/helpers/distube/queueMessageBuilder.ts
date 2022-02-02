import { Queue } from 'distube';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { updateQueuebuttons } from './updateQueueButton';
import Client from '../../entities/client';
import formatQueue from './formatQueue';

const queueMessageBuilder = (client: Client, queue: Queue) => {
  const currentSong = queue.songs[0];

  const messageEmbed: MessageEmbed = new MessageEmbed()
    .setColor('LUMINOUS_VIVID_PINK')
    .setTitle(
      `🎶 Jukebox is ON! \u3000 ${queue.songs.length} songs | ${queue.formattedDuration}`,
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
    .setImage(currentSong.thumbnail as string)
    .addField('Queue', formatQueue(queue))
    .addField('Currently playing', `${currentSong.name}`)
    .addFields(
      {
        name: 'Requester',
        value: `👤 <@${currentSong.user!.id}>`,
        inline: true,
      },
      {
        name: 'Views',
        value: `👀 ${currentSong.views.toLocaleString()}`,
        inline: true,
      },
      {
        name: 'Likes',
        value: `❤️ ${currentSong.likes.toLocaleString()}`,
        inline: true,
      },
    )
    .setTimestamp()
    .setFooter({
      text: `💊 Chill Pill ${'\u3000'.repeat(10)}`,
      iconURL: client.user?.displayAvatarURL({
        dynamic: true,
        format: 'png',
      }),
    });
  return {
    embeds: [messageEmbed],
    components: buildButtons(client, queue),
  };
};

const buildButtons = (client: Client, queue: Queue) => {
  // Update queue buttons based on client state
  updateQueuebuttons(client, queue);

  const { buttonRows } = client.queueState;

  const components = buttonRows.map((row) => {
    const messageButtons = row.map((button) => {
      const messageButon = new MessageButton()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(button.style);
      if (button.disabled) {
        messageButon.setDisabled(button.disabled);
      }
      if (button.url) {
        messageButon.setURL(button.url);
      }
      if (button.emoji) {
        messageButon.setEmoji(button.emoji);
      }
      return messageButon;
    });

    return new MessageActionRow().addComponents(...messageButtons);
  });

  return components;
};

export default queueMessageBuilder;
