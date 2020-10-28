import { CommandCollection, CommandFunction, DatamuseCommandArgs, DatamuseCommandType, DatamuseWord } from "./types";
import { datamuse, flickr } from "./http";
import { noResult } from "../responses.json";
import { INSPIRE, SYN, ANT, RHYME, TRIGGER, DESCRIBE } from "../utils/regexes";

const MAX_WORDS = 40

const datamuseArgs: { [key in DatamuseCommandType]: DatamuseCommandArgs } = {
  synonym: [SYN, 'rel_syn'],
  antonym: [ANT, 'rel_ant'],
  rhyme: [RHYME, 'rel_rhy'],
  triggers: [TRIGGER, 'rel_trg'],
  describe: [DESCRIBE, 'rel_jjb']
}

function cleanUpResponse(words: DatamuseWord[]) {
  return words.map(({ word }) => word).join(', ');
}

async function getDatamuseResponse(content: string, [regex, query]: DatamuseCommandArgs): Promise<string> {
  const [, word] = content.match(regex) || [];
  if (word) {
    const response = await datamuse.get(`?${query}=${word}`);
    const words: DatamuseWord[] = response.data;
    return cleanUpResponse(words.slice(0, MAX_WORDS));
  }
  return noResult;
}

const synonym: CommandFunction = async function(message) {
  message.reply(await getDatamuseResponse(message.content, datamuseArgs.synonym));
}

const antonym: CommandFunction = async function(message) {
  message.reply(await getDatamuseResponse(message.content, datamuseArgs.antonym));
}

const rhyme: CommandFunction = async function(message) {
  message.reply(await getDatamuseResponse(message.content, datamuseArgs.rhyme));
}

const triggers: CommandFunction = async function(message) {
  message.reply(await getDatamuseResponse(message.content, datamuseArgs.triggers));
}

const describe: CommandFunction = async function(message) {
  message.reply(await getDatamuseResponse(message.content, datamuseArgs.describe));
}

const inspire: CommandFunction = async function(message) {
  const photos = await flickr.get();
  const toShow = photos[Math.floor(Math.random() * photos.length)];
  if (toShow.url) {
    message.reply(toShow.url);
  }
}

export const lookupCommands: CommandCollection = new Map([
  [INSPIRE, inspire],
  [SYN, synonym],
  [ANT, antonym],
  [RHYME, rhyme],
  [TRIGGER, triggers],
  [DESCRIBE, describe],
])