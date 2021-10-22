import { CommandInteraction, Message } from 'discord.js';
import {
  CommandCollection,
  DatamuseCommandArgs,
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
import { Replyable } from '../utils/types';

const MAX_WORDS = 40;

const datamuseArgs: { [key in DatamuseCommandType]: DatamuseCommandArgs } = {
  synonym: [SYN, 'rel_syn'],
  antonym: [ANT, 'rel_ant'],
  rhyme: [RHYME, 'rel_rhy'],
  triggers: [TRIGGER, 'rel_trg'],
  describe: [DESCRIBE, 'rel_jjb'],
};

function cleanUpResponse(words: DatamuseWord[]) {
  return words.map(({ word }) => word).join(', ');
}

function getTargetWord(message: Replyable, regex: RegExp) {
  if (message instanceof Message) {
    const [, word] = message.content.match(regex) || [];
    return word || '';
  }
  if (message instanceof CommandInteraction) {
    return message.options.getString('word') || '';
  }
  return '';
}

async function getDatamuseResponse(message: Replyable, [regex, query]: DatamuseCommandArgs):
Promise<string> {
  const word = getTargetWord(message, regex);
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

export const lookupCommands: CommandCollection = new Map([
  [SYN, synonym],
  [ANT, antonym],
  [RHYME, rhyme],
  [TRIGGER, triggers],
  [DESCRIBE, describe],
  [INSPIRE, inspire],
]);

export const lookupSlashCommands = new Map([
  ['synonym', synonym],
  ['antonym', antonym],
  ['rhyme', rhyme],
  ['triggers', triggers],
  ['describe', describe],
  ['inspire', inspire],
]);
