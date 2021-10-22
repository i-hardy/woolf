import { sprintCommands, sprintSlashCommands, sprintButtonCommands } from './sprintCommands';
import { lookupCommands, lookupSlashCommands } from './lookupCommands';

export const commandsMap = new Map([
  ...sprintCommands,
  ...lookupCommands,
]);

export const slashCommandsMap = new Map([
  ...sprintSlashCommands,
  ...lookupSlashCommands,
]);

export const buttonCommandsMap = new Map([
  ...sprintButtonCommands,
]);

export const commandsList = Array.from(commandsMap.keys());
