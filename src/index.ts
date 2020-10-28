import Discord from 'discord.js';
import Woolf from './bot/Woolf';

(() => {
  new Woolf(Discord.Client)
    .setCommands()
    .run();
})();