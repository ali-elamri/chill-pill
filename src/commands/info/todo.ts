import { CommandInteraction, EmbedFieldData, MessageEmbed } from "discord.js";
import todosJSON from "../../data/todos.json";
import Client from "../../entities/client";
import {
  Command,
  CommandCategory,
  ExecuteFunction,
} from "../../interfaces/command";

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction
) => {
  const option = interaction.options.get("category")?.value as string;

  const fields: Array<EmbedFieldData> = todosJSON.map((section) => {
    const value =
      section.todos
        .map((todo) => {
          return `:white_check_mark: ${todo} \n`;
        })
        .join("") +
      section.done
        .map((todo) => {
          return `:x: ${todo} \n`;
        })
        .join("");

    return {
      name: section.category,
      value,
      inline: false,
    };
  });

  let messageEmbed: MessageEmbed = client.embed(
    {
      title: `Todo`,
      url: "https://github.com/Shoodey/chill-pill",
      fields,
      description:
        "Feel like coming up with additional ones? Feel free to contibute to the [GitHub repo](https://github.com/Shoodey/chill-pill) and star it!",
    },
    interaction
  );

  return interaction.reply({
    embeds: [messageEmbed],
    ephemeral: command.ephemeral,
  });
};

const command: Command = {
  name: "todo",
  aliases: [],
  options: [
    {
      name: "category",
      type: "STRING",
      description: "Todo category",
    },
  ],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.info,
  description: "Lists todos",
  usage: "/todo",
  execute,
};

export default command;
