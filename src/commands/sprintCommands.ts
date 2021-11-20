import { CommandInteraction, Message } from 'discord.js';
import { CommandFunction, ButtonFunction } from './types';
import { SPRINT } from '../utils/regexes';

const sprint: CommandFunction = async function sprint(message, server) {
  if (message instanceof Message) {
    const times = message?.content?.match(SPRINT)?.slice(1, 3).map((n) => parseInt(n, 10)) || [];
    await server?.writingSprint(message, times);
  } else if (message instanceof CommandInteraction) {
    const times = [message.options.getInteger('startin') || 0, message.options.getInteger('duration') || 0];
    await server?.writingSprint(message, times);
  }
};

const sprintingButton: ButtonFunction = async function sprintingButton(message, server) {
  await server?.joinSprintButton(message);
};

const cancelSprint: CommandFunction = async function cancelSprint(message, server) {
  await server?.cancelSprint(message);
};

const cancelSprintButton: ButtonFunction = async function cancelSprintButton(message, server) {
  await server?.cancelSprintButton(message);
};

const sprintRole: CommandFunction = async function sprintRole(message, server) {
  await server?.receiveSprintRole(message);
};

const removeSprintRole: CommandFunction = async function removeSprintRole(message, server) {
  await server?.removeSprintRole(message);
};

export const sprintCommands = new Map([
  [SPRINT, 'Use the command /sprint instead'],
  [/!sprinting/, 'Join a sprint by using the join button instead'],
  [/!cancel sprint/, 'Use the command /cancelsprint, or the cancel button instead'],
  [/!sprint role/, 'Use the command /sprintrole instead'],
  [/!remove sprint role/, 'Use the command /removesprintrole instead'],
]);

export const sprintSlashCommands = new Map([
  ['sprint', sprint],
  ['sprintrole', sprintRole],
  ['removesprintrole', removeSprintRole],
  ['cancelsprint', cancelSprint],
]);

export const sprintButtonCommands = new Map([
  ['joinsprint', sprintingButton],
  ['cancelsprint', cancelSprintButton],
]);
