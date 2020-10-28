import { Message } from 'discord.js';
import WoolfServer from "../WoolfServer";
import { SPRINT } from './regexes';

interface CommandFunction {
  (message: Message, server?: WoolfServer): void;
}

type CommandCollection = Map<RegExp, CommandFunction>;

function sprint(message: Message, server?: WoolfServer) {
  server?.writingSprint(message);
}

function sprinting(message: Message, server?: WoolfServer) {
  server?.joinSprint(message);
}

function cancelSprint(message: Message, server?: WoolfServer) {
  server?.cancelSprint(message);
}

function sprintRole(message: Message, server?: WoolfServer) {
  server?.receiveSprintRole(message);
}

function removeSprintRole(message: Message, server?: WoolfServer) {
  server?.removeSprintRole(message);
}

export const sprintCommands: CommandCollection = new Map([
  [SPRINT, sprint],
  [/!sprinting/, sprinting],
  [/!cancel sprint/, cancelSprint],
  [/!sprint role/, sprintRole],
  [/!remove sprint role/, removeSprintRole]
])
