import {
  Client as DJSClient,
  ClientOptions,
  Collection,
  CommandInteraction,
  MessageEmbed,
  MessageEmbedOptions,
} from 'discord.js';
import { promisify } from 'util';
import glob from 'glob';
import DisTube, { Queue } from 'distube';
import { YouTubeDLPlugin } from '@distube/yt-dlp';
import { DistubeArgs, DistubeEvent, Event } from '../interfaces/event';
import { Config } from './config';
import Logger from './logger';
import {
  SlashCommand,
  CommandCategory,
  CommandType,
  Command,
} from '../interfaces/command';
// import GuildService from '../services/guildService';

const globPromise = promisify(glob);
class Client extends DJSClient {
  public config: Config;

  public events: Collection<string, Event | DistubeEvent> = new Collection();

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

  public queue: Queue | null = null;

  constructor(options: ClientOptions, config: Config) {
    super(options);
    this.config = config;
  }

  public async boot() {
    this.loadEvents();
    this.loadDistubeEvent();
    this.loadCommands();

    this.login(this.config.client_token)
      .then(() => {
        Logger.info("It's alive.");
      })
      .catch((e) => {
        Logger.error(e);
      });
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

  public setQueue(queue: Queue): void {
    this.queue = queue;
  }

  private async loadEvents() {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/{client,guild}/*{.ts,.js}`,
    );

    eventFiles.map(async (eventFile: string) => {
      const event: Event = await this.importFile(eventFile);
      this.events.set(event.name, event);

      if (event.once) {
        this.once(event.name, (interaction) => {
          event.execute(this, interaction);
        });
      } else {
        this.on(event.name, (interaction) => {
          event.execute(this, interaction);
        });
      }
    });
  }

  private async loadDistubeEvent() {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/distube/*{.ts,.js}`,
    );

    eventFiles.map(async (eventFile: string) => {
      const event: DistubeEvent = await this.importFile(eventFile);
      this.events.set(event.name, event);

      this.distube.on(event.name, (...args: DistubeArgs) => {
        event.execute(this, ...args);
      });
    });
  }

  private async loadCommands() {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`,
    );

    commandFiles.map(async (commandFile: string) => {
      const command: SlashCommand = await this.importFile(commandFile);

      this.commands.set(command.name, command);
      this.categories.add(command.category);
    });
  }

  private async importFile(file: string) {
    return (await import(file))?.default;
  }
}

export default Client;
