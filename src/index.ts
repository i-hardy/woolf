import Discord from 'discord.js';
import Woolf from './bot/Woolf';

(() => {
  Woolf(Discord.Client)
    .setCommands()
    .run();
})();