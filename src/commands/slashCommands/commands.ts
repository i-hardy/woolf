import { SlashCommandBuilder } from '@discordjs/builders';
import { sprintCommands, lookupCommands } from './commandDescriptions.json';

type CommandParameters = {
  name: string;
  description: string;
  required: boolean;
};

type SlashCommandBuilderWithOptions = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

const sprint = Object.entries(sprintCommands).map(
  ([commandName, details]) => {
    const slashCommand = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(details.description);
    if (details.parameters.length) {
      const withParameters = (details.parameters as CommandParameters[])
        .reduce<SlashCommandBuilderWithOptions>((commandBuilder, param) => commandBuilder
        .addIntegerOption(
          (option) => option
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        ), slashCommand);
      return withParameters;
    }
    return slashCommand;
  },
);

const lookup = Object.entries(lookupCommands).map(
  ([commandName, details]) => {
    const slashCommand = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(details.description);
    if (details.parameters.length) {
      const withParameters = (details.parameters as CommandParameters[])
        .reduce<SlashCommandBuilderWithOptions>((commandBuilder, param) => commandBuilder
        .addStringOption(
          (option) => option
            .setName(param.name)
            .setDescription(param.description)
            .setRequired(param.required),
        ), slashCommand);
      return withParameters;
    }
    return slashCommand;
  },
);

export const commands = [
  ...sprint,
  ...lookup,
];
