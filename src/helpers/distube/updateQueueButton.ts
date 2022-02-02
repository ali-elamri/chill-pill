import { Queue } from 'distube';
import { ButtonRow, QueueButton } from '../../interfaces/queueState';
import Client from '../../entities/client';

export const updateQueuebuttons = (client: Client, queue: Queue) => {
  // Stopped State
  if (!queue || queue.stopped) {
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
