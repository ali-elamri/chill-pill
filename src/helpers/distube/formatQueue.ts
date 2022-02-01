import { Queue, Song } from 'distube';
import { join } from 'lodash';

const formatQueue = (q: Queue, s: Song) => {
  const queueSubset = q.songs.slice(0, 10);

  const queueList: string[] = queueSubset.map((item, id) => {
    return `**${id + 1}** - ${item.name} | \`${item.formattedDuration}\``;
  });

  return join(queueList, '\n');
};

export default formatQueue;
