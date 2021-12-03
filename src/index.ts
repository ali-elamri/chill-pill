import Client from "./entities/client";
import { config } from "./entities/config";
import { ClientOptions, Intents } from "discord.js";

const options: ClientOptions = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "GUILD_MEMBER", "CHANNEL", "REACTION", "USER"],
};

new Client(options, config).boot();
