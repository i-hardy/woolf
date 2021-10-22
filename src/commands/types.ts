import { ButtonInteraction } from 'discord.js';
import WoolfServer from '../bot/WoolfServer';
import { Replyable } from '../utils/types';

export interface CommandFunction {
  (message: Replyable, server?: WoolfServer): Promise<void>;
}

export interface CommandFunctionWithButton {
  (message: ButtonInteraction, server?: WoolfServer): Promise<void>;
}

export type CommandCollection = Map<RegExp, CommandFunction>;

export enum DatamuseCommandType {
  'synonym' = 'synonym',
  'antonym' = 'antonym',
  'rhyme' = 'rhyme',
  'triggers' = 'triggers',
  'describe' = 'describe',
}

export type DatamuseCommandArgs = [RegExp, string];

export type DatamuseWord = {
  word: string,
  score?: number,
};

export type FlickrPhoto = {
  id: string,
  url_l?: string,
};
