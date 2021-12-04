import { Client as DJSClient, ClientOptions } from "discord.js";
import { promisify } from "util";
import { Event } from "../interfaces/event";
import { Config } from "./config";
import Logger from "./logger";
import glob from "glob";

const globPromise = promisify(glob);
class Client extends DJSClient {
  public config: Config;

  constructor(options: ClientOptions, config: Config) {
    super(options);
    this.config = config;
  }

  public async boot() {
    this._loadEvents();

    this.login(this.config.client_token)
      .then(() => Logger.info(`It's alive.`))
      .catch((e) => Logger.error(e));
  }

  private async _loadEvents() {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/*/*{.ts,.js}`
    );
    eventFiles.map(async (eventFile: string) => {
      const event: Event = await this._importFile(eventFile);
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

  private async _importFile(file: string) {
    return (await import(file))?.default;
  }
}

export default Client;
