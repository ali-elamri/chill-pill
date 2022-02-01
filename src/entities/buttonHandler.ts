import { ButtonInteraction, Guild, GuildMember } from 'discord.js';
import { Queue } from 'distube';
import Client from './client';

const buttonInteractionMap = [
  {
    category: 'music',
    actions: [
      'queuePause',
      'queueResume',
      'queueStop',
      'queuePrevious',
      'queueNext',
      'queueShuffle',
    ],
  },
];

const mapButtonActionToCategory = (action: string): string => {
  return buttonInteractionMap.find((e) => {
    return e.actions.includes(action);
  })!.category;
};

export default function handleButtonInteraction(
  client: Client,
  interaction: ButtonInteraction,
): void {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild as Guild;
  const buttonInteractionCategory = mapButtonActionToCategory(
    interaction.customId,
  );

  let queue = client.distube.getQueue(interaction);

  if (!queue) {
    return;
  }

  if (!queue.songs) {
    queue = client.queue as Queue;
  }

  if (member.voice.channel && !guild.me?.voice.channel) {
    client.distube.voices.join(member.voice.channel);
  }

  switch (buttonInteractionCategory) {
    case 'music': {
      switch (interaction.customId) {
        // case 'queuePause': {
        //   if (!queue.paused && !queue.stopped) {
        //     queue.pause();
        //     interaction.deferUpdate();
        //   }
        //   break;
        // }
        case 'queueResume': {
          if (queue.paused && !queue.stopped) {
            queue.resume();
            interaction.deferUpdate();
          }
          break;
        }
        case 'queueStop': {
          if (!queue.stopped) {
            queue.stop();
            interaction.deferUpdate();
          }
          break;
        }
        case 'queuePrevious': {
          if (queue.previousSongs.length && !queue.stopped) {
            queue.previous();
            interaction.deferUpdate();
          }
          break;
        }
        case 'queueNext': {
          if (!queue.stopped) {
            queue.skip();

            interaction.deferUpdate();
          }
          break;
        }
        case 'queueShuffle': {
          if (!queue.stopped) {
            queue.shuffle();
            interaction.deferUpdate();
          }
          break;
        }
        default: {
          break;
        }
      }

      break;
    }
    default: {
      break;
    }
  }
}
