import { Queue } from 'distube';
import { ButtonRow, QueueButton } from '../../interfaces/queueState';
import Client from '../../entities/client';

import queueButtonRows from '../../data/queueButtonRows.json';

export const updateQueuebuttons = (client: Client) => {
  const queue = client.queueState.queue as Queue;

  // Check if buttonRows have been initialised
  const { buttonRows } = client.queueState;
  const { isPlaying } = client.queueState;

  if (!buttonRows || isPlaying) {
    client.setQueueButtonRows(queueButtonRows.on as ButtonRow[]);
  }
  if (!isPlaying) {
    client.setQueueButtonRows(queueButtonRows.off as ButtonRow[]);
  }

  if (!queue || queue.stopped) {
    // Stopped State
    updateQueueButton(client, 'queuePreviousPage', { disabled: true });
    updateQueueButton(client, 'queueNextPage', { disabled: true });
    updateQueueButton(client, 'queuePause', { disabled: true });
    updateQueueButton(client, 'queueResume', { disabled: true });
    updateQueueButton(client, 'queueStop', { disabled: true });
    updateQueueButton(client, 'queuePrevious', { disabled: true });
    updateQueueButton(client, 'queueNext', { disabled: true });
    updateQueueButton(client, 'queueShuffle', { disabled: true });
  }

  // Paused & Playing States
  if (queue.paused) {
    updateQueueButton(client, 'queuePause', { disabled: true });
    updateQueueButton(client, 'queueResume', { disabled: false });
    updateQueueButton(client, 'queueSeekReset', { disabled: true });
  } else {
    updateQueueButton(client, 'queuePause', { disabled: false });
    updateQueueButton(client, 'queueResume', { disabled: true });
    updateQueueButton(client, 'queueSeekReset', { disabled: false });
  }

  // Pagination
  const { currentPage, totalPages } = client.queueState.pagination;
  // Previous Page
  if (currentPage === 1) {
    updateQueueButton(client, 'queuePreviousPage', { disabled: true });
  } else {
    updateQueueButton(client, 'queuePreviousPage', { disabled: false });
  }
  // Next Page
  if (currentPage === totalPages) {
    updateQueueButton(client, 'queueNextPage', { disabled: true });
  } else {
    updateQueueButton(client, 'queueNextPage', { disabled: false });
  }
};

export const updateQueueButton = (
  client: Client,
  customId: string,
  updatedButtonValues: {},
): void => {
  const buttonRows: ButtonRow[] = client.queueState.buttonRows.map(
    (buttonRow) => {
      const buttons: QueueButton[] = buttonRow.map((button) => {
        return button.customId === customId
          ? { ...button, ...updatedButtonValues }
          : button;
      });
      return buttons;
    },
  );

  client.setQueueButtonRows(buttonRows);
};
