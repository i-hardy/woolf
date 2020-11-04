import { sprintCommands } from './sprintCommands';
import { lookupCommands } from './lookupCommands';

export const commandsMap = new Map([
  ...sprintCommands,
  ...lookupCommands,
]);

export const commandsList = Array.from(commandsMap.keys());
