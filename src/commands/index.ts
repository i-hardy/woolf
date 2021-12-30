import { sprintSlashCommands, sprintButtonCommands } from './sprintCommands';
import { lookupSlashCommands } from './lookupCommands';

export const slashCommandsMap = new Map([
  ...sprintSlashCommands,
  ...lookupSlashCommands,
]);

export const buttonCommandsMap = new Map([
  ...sprintButtonCommands,
]);
