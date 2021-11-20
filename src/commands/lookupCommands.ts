import { CommandInteraction } from 'discord.js';
import {
  DatamuseCommandType,
  DatamuseWord,
  FlickrPhoto,
  CommandFunction,
} from './types';
import { datamuse, flickr } from './http';
import { noResult } from '../responses.json';
import {
  INSPIRE, SYN, ANT, RHYME, TRIGGER, DESCRIBE,
} from '../utils/regexes';

const MAX_WORDS = 40;

const datamuseArgs: { [key in DatamuseCommandType]: string } = {
  synonym: 'rel_syn',
  antonym: 'rel_ant',
  rhyme: 'rel_rhy',
  triggers: 'rel_trg',
  describe: 'rel_jjb',
};

function cleanUpResponse(words: DatamuseWord[]) {
  return words.map(({ word }) => word).join(', ');
}

function getTargetWord(message: CommandInteraction) {
  return message.options.getString('word') || '';
}

async function getDatamuseResponse(
  message: CommandInteraction,
  query: string,
): Promise<string> {
  const word = getTargetWord(message);
  if (word) {
    const response = await datamuse.get('/', {
      params: {
        [query]: word,
      },
    });
    const words: DatamuseWord[] = response.data;
    if (words.length) {
      return cleanUpResponse(words.slice(0, MAX_WORDS));
    }
    return noResult;
  }
  return noResult;
}

const synonym: CommandFunction = async function synonym(message) {
  await message.reply(await getDatamuseResponse(message, datamuseArgs.synonym));
};

const antonym: CommandFunction = async function antonym(message) {
  await message.reply(await getDatamuseResponse(message, datamuseArgs.antonym));
};

const rhyme: CommandFunction = async function rhyme(message) {
  await message.reply(await getDatamuseResponse(message, datamuseArgs.rhyme));
};

const triggers: CommandFunction = async function trigger(message) {
  await message.reply(await getDatamuseResponse(message, datamuseArgs.triggers));
};

const describe: CommandFunction = async function describe(message) {
  await message.reply(await getDatamuseResponse(message, datamuseArgs.describe));
};

async function getFlickrResponse(): Promise<FlickrPhoto[]> {
  try {
    const response = await flickr.get('/');
    return response.data?.photos?.photo;
  } catch (error) {
    return [];
  }
}

const inspire: CommandFunction = async function inspire(message) {
  const photos = await getFlickrResponse();
  const toShow = photos[Math.floor(Math.random() * photos.length)];
  if (toShow?.url_l) {
    await message.reply(toShow.url_l);
  }
};

export const lookupCommands = new Map([
  [SYN, 'Use the command /synonym instead'],
  [ANT, 'Use the command /antonym instead'],
  [RHYME, 'Use the command /rhyme instead'],
  [TRIGGER, 'Use the command /related instead'],
  [DESCRIBE, 'Use the command /describe instead'],
  [INSPIRE, 'Use the command /inspire instead'],
]);

export const lookupSlashCommands = new Map([
  ['synonym', synonym],
  ['antonym', antonym],
  ['rhyme', rhyme],
  ['related', triggers],
  ['describe', describe],
  ['inspire', inspire],
]);
