import { Queue } from 'distube';
import Client from '../../entities/client';

const computePagination = (client: Client, queue: Queue) => {
  const { perPage, currentPage, totalPages } = client.queueState.pagination;

  const songsCount = queue.songs.length;
  const updatedTotalPages = Math.floor((songsCount + perPage - 1) / perPage);

  client.setQueuePagination({
    ...client.queueState.pagination,
    ...{ totalPages: updatedTotalPages },
  });

  return client.queueState.pagination;
};

export default computePagination;
