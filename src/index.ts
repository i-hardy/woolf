import Discord from 'discord.js';
import Woolf from './bot/Woolf';

(() => {
  const woolf = new Woolf(Discord.Client)
    .guildEvents()
    .setCommands()
    .run();
  const stop = woolf.stopGracefully.bind(woolf);
  process.on('SIGINT', stop);
  // process.on('SIGTERM', stop);
  // process.on('SIGKILL', stop);
})();