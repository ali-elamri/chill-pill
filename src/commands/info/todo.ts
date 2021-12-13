import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';
import { upperFirst } from 'lodash';
import moment from 'moment';
import { TodoGrouping, TodoCategory } from '../../interfaces/todo';
import Client from '../../entities/client';
import {
  Command,
  CommandCategory,
  ExecuteFunction,
} from '../../interfaces/command';
import TodoService from '../../services/todoService';

const execute: ExecuteFunction = async (
  client: Client,
  interaction: CommandInteraction,
) => {
  const categoryOption = interaction.options.getString('category');
  let todoCategories = (await TodoService.all({
    emojify: true,
    groupBy: 'category',
  })) as TodoGrouping[];

  if (categoryOption && categoryOption in TodoCategory) {
    todoCategories = todoCategories.filter((category) => {
      return category.name === categoryOption;
    });
  }

  const fields: Array<EmbedFieldData> = todoCategories.map((category) => {
    return {
      name: `${upperFirst(category.name)} (${category.count})`,
      value: category.todos
        .map((todo) => {
          return `\`${
            todo.name
          }\` \t\t\tby ${interaction.guild?.members.cache.get(
            todo.author,
          )} ${moment(todo.created_at).fromNow()}`;
        })
        .join('\n'),
      inline: false,
    };
  });

  const todosCount = todoCategories.reduce((acc, curr) => {
    return acc + curr.count;
  }, 0);

  const messageEmbed: MessageEmbed = client.embed(
    {
      title: `Chill Pill - Todos (${todosCount})`,
      url: 'https://github.com/Shoodey/chill-pill',
      fields,
      description:
        'Feel like coming up with additional ones? Feel free to contibute to the [GitHub repo](https://github.com/Shoodey/chill-pill) and star it!',
    },
    interaction,
  );

  return interaction.reply({
    embeds: [messageEmbed],
    ephemeral: command.ephemeral,
  });
};

const command: Command = {
  name: 'todo',
  aliases: [],
  options: [
    {
      name: 'category',
      type: 'STRING',
      description: 'Todo category',
      choices: [
        {
          name: 'Structure',
          value: TodoCategory.structure,
        },
        {
          name: 'Features',
          value: TodoCategory.features,
        },
        {
          name: 'Commands',
          value: TodoCategory.commands,
        },
        {
          name: 'Events',
          value: TodoCategory.events,
        },
      ],
    },
  ],
  ephemeral: true,
  cooldown: 3,
  category: CommandCategory.info,
  description: 'Lists todos',
  usage: '/todo ?category',
  execute,
};

export default command;
