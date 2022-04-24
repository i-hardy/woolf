import Discord from 'discord.js';
import { logger } from './utils/logger';
import Woolf from './bot/Woolf';

(() => {
  const woolf = new Woolf(Discord.Client)
    .errorEvents()
    .guildEvents()
    .messageEvents()
    .run();
  const stop = woolf.stopGracefully.bind(woolf);

  process.on('unhandledRejection', (error) => {
    logger.exception(error as Error, 'Unhandled promise rejection:');
  });

  process.on('uncaughtException', (error) => {
    logger.exception(error as Error, 'Uncaught exception:');
  });

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})();
