import {
  Client as DJSClient,
  ClientOptions,
  Collection,
  Guild,
} from "discord.js";
import { promisify } from "util";
import { Event } from "../interfaces/event";
import { Config } from "./config";
import Logger from "./logger";
import glob from "glob";
import { Command, CommandCategory } from "../interfaces/command";

const globPromise = promisify(glob);
class Client extends DJSClient {
  public config: Config;
  public events: Collection<string, Event> = new Collection();
  public commands: Collection<string, Command> = new Collection();
  public categories: Set<string> = new Set();

  constructor(options: ClientOptions, config: Config) {
    super(options);
    this.config = config;
  }

  public async boot() {
    this._loadEvents();
    this._loadCommands();

    this.login(this.config.client_token)
      .then(() => Logger.info(`It's alive.`))
      .catch((e) => Logger.error(e));
  }

  public async registerGuildCommands() {
    const commands: Command[] = [...this.commands.values()].filter(
      (command: Command) => command.category !== CommandCategory.admin
    );

    if (!this.config.guilds.length) {
      this.registerGlobalCommands();
      return;
    }

    this.config.guilds.map((guild_id) => {
      const guild = this.guilds.cache.get(guild_id);
      if (!guild) {
        Logger.error(`Could not load commands for server with ID: ${guild_id}`);
        return;
      }
      guild.commands.set(commands);
    });
  }

  public async registerGlobalCommands() {
    Logger.info("Registering global commands.");
    // TODO
  }

  private async _loadEvents() {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/*/*{.ts,.js}`
    );

    eventFiles.map(async (eventFile: string) => {
      const event: Event = await this._importFile(eventFile);
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

  private async _loadCommands() {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );

    commandFiles.map(async (commandFile: string) => {
      const command: Command = await this._importFile(commandFile);
      this.commands.set(command.name, command);
      this.categories.add(command.category);
    });
  }

  private async _importFile(file: string) {
    return (await import(file))?.default;
  }
}

export default Client;
