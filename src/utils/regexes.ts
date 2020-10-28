const MATCH_ONE = '\s([a-zA-Z]*\b+)';

// const MATCH_ALL = '\s(.*)';

export const INFO = /(!\w+.+){2,}/m;

export const QUOTE = /(`|"|')!\w+/;

export const SPRINT = /!sprint in (\d+) for (\d+)/

export const SYN = new RegExp(`!synonym${MATCH_ONE}`);

export const ANT = new RegExp(`!antonym${MATCH_ONE}`);

export const RHYME = new RegExp(`!rhyme${MATCH_ONE}`);

export const TRIGGER = new RegExp(`!related${MATCH_ONE}`);

export const DESCRIBE = new RegExp(`!describe${MATCH_ONE}`);
