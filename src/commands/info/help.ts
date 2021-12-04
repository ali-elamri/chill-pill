import { CommandInteraction } from "discord.js";
import Client from "../../entities/client";
import {
  Command,
  CommandCategory,
  ExecuteFunction,
} from "../../interfaces/command";

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction
) => {};

const command: Command = {
  name: "help",
  aliases: [],
  options: [
    {
      name: "command",
      type: "STRING",
      description: "Get additional information for the command.",
    },
  ],
  ephemeral: true,
  cooldown: 0,
  category: CommandCategory.info,
  description: "Lists available useful (or not) commands.",
  usage: "/help ?command",
  execute,
};

export default command;
