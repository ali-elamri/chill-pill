import { Queue } from 'distube';
import { join } from 'lodash';
import Client from '../../entities/client';

const formatQueue = (client: Client) => {
  const queue = client.queueState.queue as Queue;

  const songsList = queue.songs;

  if (!songsList) {
    return 'The queue is currently empty...';
  }

  const { perPage, currentPage } = client.queueState.pagination;

  const songsInPage = songsList.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const queueList: string[] = songsInPage.map((item, id) => {
    return `**${id + 1 + (currentPage - 1) * 10}** - ${item.name} | \`${
      item.formattedDuration
    }\``;
  });

  return join(queueList, '\n');
};

export default formatQueue;
