const MATCH_ONE = '\\s([a-zA-Z]*\\b)';

export const COMMAND = /![a-zA-Z]/;

export const INFO = /(!\w+.+){2,}/m;

export const QUOTE = /(`|"|')!\w+/;

export const SPRINT = /!sprint in (\d+) for (\d+)/;

export const INSPIRE = /!inspiration/;

export const SUPPORT = /!woolf support/;

export const SYN = new RegExp(`!synonym${MATCH_ONE}`);

export const ANT = new RegExp(`!antonym${MATCH_ONE}`);

export const RHYME = new RegExp(`!rhyme${MATCH_ONE}`);

export const TRIGGER = new RegExp(`!related${MATCH_ONE}`);

export const DESCRIBE = new RegExp(`!describe${MATCH_ONE}`);
