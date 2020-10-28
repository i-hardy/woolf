import { CommandCollection, CommandFunction } from './types';
import { SPRINT } from '../utils/regexes';

const sprint: CommandFunction = function(message, server) {
  server?.writingSprint(message);
}

const sprinting: CommandFunction = function(message, server) {
  server?.joinSprint(message);
}

const cancelSprint: CommandFunction = function(message, server) {
  server?.cancelSprint(message);
}

const sprintRole: CommandFunction = function(message, server) {
  server?.receiveSprintRole(message);
}

const removeSprintRole: CommandFunction = function(message, server) {
  server?.removeSprintRole(message);
}

export const sprintCommands: CommandCollection = new Map([
  [SPRINT, sprint],
  [/!sprinting/, sprinting],
  [/!cancel sprint/, cancelSprint],
  [/!sprint role/, sprintRole],
  [/!remove sprint role/, removeSprintRole]
])
