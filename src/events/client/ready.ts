import Logger from "../../entities/logger";
import { Event } from "../../interfaces/event";
import { ExecuteFunction } from "../../interfaces/event";

const execute: ExecuteFunction = async (client, interaction) => {
  client.user?.setActivity("Chilling... 💊");

  Logger.info(`💊 Chill Pill is ready!`);
};

export default {
  name: "ready",
  once: true,
  execute,
} as Event;
