import { Message } from 'discord.js';
import WoolfServer from "../bot/WoolfServer";

export interface CommandFunction {
  (message: Message, server?: WoolfServer): void;
}

export type CommandCollection = Map<RegExp, CommandFunction>;

export enum DatamuseCommandType {
  'synonym' = 'synonym',
  'antonym' = 'antonym',
  'rhyme' = 'rhyme',
  'triggers' = 'triggers',
  'describe' = 'describe'
}

export type DatamuseCommandArgs = [RegExp, string];

export type DatamuseWord = {
  word: string,
  score?: number,
}