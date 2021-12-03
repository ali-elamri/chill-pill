import { Client as DJSClient, ClientOptions } from "discord.js";
import { Config } from "./config";
import Logger from "./logger";

class Client extends DJSClient {
  public config: Config;

  constructor(options: ClientOptions, config: Config) {
    super(options);
    this.config = config;
  }

  public async boot() {
    this.login(this.config.client_token)
      .then(() => Logger.info(`It's alive.`))
      .catch((e) => Logger.error(e));
  }
}

export default Client;
