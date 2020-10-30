import { CommandCollection, CommandFunction } from './types';
import { SPRINT } from '../utils/regexes';

const sprint: CommandFunction = async function(message, server) {
  server?.writingSprint(message);
}

const sprinting: CommandFunction = async function(message, server) {
  server?.joinSprint(message);
}

const cancelSprint: CommandFunction = async function(message, server) {
  server?.cancelSprint(message);
}

const sprintRole: CommandFunction = async function(message, server) {
  server?.receiveSprintRole(message);
}

const removeSprintRole: CommandFunction = async function(message, server) {
  server?.removeSprintRole(message);
}

export const sprintCommands: CommandCollection = new Map([
  [SPRINT, sprint],
  [/!sprinting/, sprinting],
  [/!cancel sprint/, cancelSprint],
  [/!sprint role/, sprintRole],
  [/!remove sprint role/, removeSprintRole]
])
