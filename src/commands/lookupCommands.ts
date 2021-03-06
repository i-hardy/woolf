import {
  CommandCollection,
  CommandFunction,
  DatamuseCommandArgs,
  DatamuseCommandType,
  DatamuseWord,
  FlickrPhoto,
} from './types';
import { datamuse, flickr } from './http';
import { noResult, support } from '../responses.json';
import {
  INSPIRE, SYN, ANT, RHYME, TRIGGER, DESCRIBE, SUPPORT,
} from '../utils/regexes';

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

async function getDatamuseResponse(content: string, [regex, query]: DatamuseCommandArgs):
Promise<string> {
  const [, word] = content.match(regex) || [];
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
  await message.reply(await getDatamuseResponse(message.content, datamuseArgs.synonym));
};

const antonym: CommandFunction = async function antonym(message) {
  await message.reply(await getDatamuseResponse(message.content, datamuseArgs.antonym));
};

const rhyme: CommandFunction = async function rhyme(message) {
  await message.reply(await getDatamuseResponse(message.content, datamuseArgs.rhyme));
};

const triggers: CommandFunction = async function trigger(message) {
  await message.reply(await getDatamuseResponse(message.content, datamuseArgs.triggers));
};

const describe: CommandFunction = async function describe(message) {
  await message.reply(await getDatamuseResponse(message.content, datamuseArgs.describe));
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

const woolfSupport: CommandFunction = async function woolfSupport(message) {
  await message.channel.send(support);
};

export const lookupCommands: CommandCollection = new Map([
  [SYN, synonym],
  [ANT, antonym],
  [RHYME, rhyme],
  [TRIGGER, triggers],
  [DESCRIBE, describe],
  [INSPIRE, inspire],
  [SUPPORT, woolfSupport],
]);
