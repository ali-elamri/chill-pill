import {
  Client as DJSClient,
  ClientOptions,
  Collection,
  CommandInteraction,
  Message,
  MessageEmbed,
  MessageEmbedOptions,
} from 'discord.js';
import { promisify } from 'util';
import glob from 'glob';
import DisTube, { Queue } from 'distube';
import { YouTubeDLPlugin } from '@distube/yt-dlp';
import {
  QueuePagination,
  ButtonRow,
  QueueState,
} from '../interfaces/queueState';
import {
  ButtonCommand,
  CommandType,
  SlashCommand,
  CommandCategory,
  Command,
} from '../interfaces/command';
import {
  ClientEvent,
  DistubeEvent,
  CustomEvent,
  DistubeArgs,
  Event,
  EventType,
} from '../interfaces/event';
import { Config } from './config';
import Logger from './logger';
// import GuildService from '../services/guildService';

const globPromise = promisify(glob);
class Client extends DJSClient {
  public config: Config;

  public events: Collection<string, Event> = new Collection();

  public commands: Collection<string, Command> = new Collection();

  public categories: Set<string> = new Set();

  public distube = new DisTube(this, {
    emitNewSongOnly: false,
    leaveOnFinish: true,
    leaveOnStop: false,
    youtubeDL: false,
    emptyCooldown: 3,
    plugins: [new YouTubeDLPlugin()],
  });

  public queueState: QueueState = {
    queue: null,
    pagination: {
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
    },
    message: null,
    buttonRows: [
      [
        {
          customId: 'queuePreviousPage',
          label: 'Previous Page',
          style: 'SECONDARY',
          disabled: true,
        },
        {
          customId: 'queueNextPage',
          label: 'Next Page',
          style: 'SECONDARY',
          disabled: true,
        },
      ],
      [
        {
          customId: 'queuePause',
          label: 'Pause',
          style: 'SUCCESS',
          disabled: false,
        },
        {
          customId: 'queueResume',
          label: 'Resume',
          style: 'SUCCESS',
          disabled: true,
        },
        {
          customId: 'queueSeekReset',
          label: 'Restart Song',
          style: 'SECONDARY',
          disabled: false,
        },
      ],
      [
        {
          customId: 'queuePrevious',
          label: 'Previous',
          style: 'PRIMARY',
          disabled: false,
        },
        {
          customId: 'queueNext',
          label: 'Next',
          style: 'PRIMARY',
          disabled: false,
        },
        {
          customId: 'queueShuffle',
          label: 'Shuffle',
          style: 'SECONDARY',
          disabled: false,
        },
        {
          customId: 'queueStop',
          label: 'Stop & Clear',
          style: 'DANGER',
          disabled: false,
        },
      ],
    ],
  };

  constructor(options: ClientOptions, config: Config) {
    super(options);
    this.config = config;
  }

  public async boot() {
    this.loadEvents();
    // this.loadDistubeEvent();
    this.loadCommands();

    this.login(this.config.client_token)
      .then(() => {
        Logger.info("It's alive.");
      })
      .catch((e) => {
        Logger.error(e);
      });
  }

  public setQueueMessage(queueMessage: Message<boolean>): void {
    this.queueState.message = queueMessage;
  }

  public setQueue(queue: Queue): void {
    this.queueState.queue = { ...queue } as Queue;
  }

  public setQueueButtonRows(buttonRows: ButtonRow[]): void {
    this.queueState.buttonRows = buttonRows;
  }

  public setQueuePagination(queuePagination: QueuePagination): void {
    this.queueState.pagination = queuePagination;
  }

  public embed(
    data: MessageEmbedOptions,
    interaction: CommandInteraction,
  ): MessageEmbed {
    return new MessageEmbed({
      ...data,
      color: 'LUMINOUS_VIVID_PINK', // #E91E63
      footer: {
        text: `${interaction.user.tag} | 💊 Chill Pill`,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
          format: 'png',
        }),
      },
    });
  }

  public async registerGuildCommands() {
    const commands: Command[] = [...this.commands.values()].filter(
      (command) => {
        return (
          command.commandType !== CommandType.button &&
          command.category !== CommandCategory.admin
        );
      },
    );

    if (!this.config.guilds.length) {
      this.registerGlobalCommands();
      return;
    }

    this.config.guilds.forEach((guild_id) => {
      const guild = this.guilds.cache.get(guild_id);
      if (!guild) {
        Logger.error(`Could not load commands for server with ID: ${guild_id}`);
        return;
      }
      guild.commands.set(commands);
      // GuildService.save(guild.id, guild.name);
    });
  }

  public async registerGlobalCommands() {
    Logger.info('Registering global commands.');
    // TODO
  }

  private async loadEvents() {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/*/*{.ts,.js}`,
    );

    eventFiles.map(async (eventFile: string) => {
      const event: Event = await this.importEvent(eventFile);
      this.events.set(event.name, event);

      switch (event.eventType) {
        case EventType.client: {
          const ev = event as ClientEvent;
          if (ev.once) {
            this.once(ev.name, (interaction) => {
              ev.execute(this, interaction);
            });
          } else {
            this.on(ev.name, (interaction) => {
              ev.execute(this, interaction);
            });
          }
          break;
        }
        case EventType.custom: {
          const ev = event as CustomEvent;
          this.on(ev.name, (...args: unknown[]) => {
            ev.execute(...args);
          });
          break;
        }
        case EventType.distube: {
          const ev = event as DistubeEvent;
          this.distube.on(ev.name, (...args: DistubeArgs) => {
            ev.execute(this, ...args);
          });
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  private async loadCommands() {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`,
    );

    commandFiles.map(async (commandFile: string) => {
      const command: Command = await this.importCommand(commandFile);

      this.commands.set(command.name, command);
      this.categories.add(command.category);
    });
  }

  private async importCommand(file: string): Promise<Command> {
    const command: Command = (await import(file))?.default;
    switch (command.commandType) {
      case CommandType.command:
        return command as SlashCommand;

      case CommandType.button:
        return command as ButtonCommand;

      default:
        return command;
    }
  }

  private async importEvent(file: string): Promise<Event> {
    const event: Event = (await import(file))?.default;
    switch (event.eventType) {
      case EventType.client:
        return event as ClientEvent;

      case EventType.custom:
        return event as CustomEvent;

      case EventType.distube:
        return event as DistubeEvent;

      default:
        return event;
    }
  }
}

export default Client;
