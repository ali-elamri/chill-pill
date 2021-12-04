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
  name: "ping",
  aliases: [],
  options: [],
  ephemeral: true,
  cooldown: 0,
  category: CommandCategory.info,
  description: "Pings you back... duh!",
  usage: "/ping",
  execute,
};

export default command;
