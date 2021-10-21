import { CommandCollection, CommandFunction } from './types';
import { SPRINT } from '../utils/regexes';

const sprint: CommandFunction = async function sprint(message, server) {
  await server?.writingSprint(message);
};

const sprinting: CommandFunction = async function sprinting(message, server) {
  await server?.joinSprint(message);
};

const cancelSprint: CommandFunction = async function cancelSprint(message, server) {
  await server?.cancelSprint(message);
};

const sprintRole: CommandFunction = async function sprintRole(message, server) {
  await server?.receiveSprintRole(message);
};

const removeSprintRole: CommandFunction = async function removeSprintRole(message, server) {
  await server?.removeSprintRole(message);
};

export const sprintCommands: CommandCollection = new Map([
  [SPRINT, sprint],
  [/!sprinting/, sprinting],
  [/!cancel sprint/, cancelSprint],
  [/!sprint role/, sprintRole],
  [/!remove sprint role/, removeSprintRole],
]);

export const sprintSlashCommands = new Map([
  ['sprint', sprint],
  ['sprinting', sprinting],
  ['cancel', cancelSprint],
]);
