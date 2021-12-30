import { CommandFunction, ButtonFunction } from './types';

const sprint: CommandFunction = async function sprint(message, server) {
  const times = [message.options.getInteger('startin') || 0, message.options.getInteger('duration') || 0];
  await server?.writingSprint(message, times);
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
