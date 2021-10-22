import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { TOKEN, CLIENT_ID } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { commands } from './commands';

const jsonCommands = commands.map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN);

export function setUpSlashCommands(): Promise<unknown> {
  return rest.put(Routes.applicationCommands(CLIENT_ID), { body: jsonCommands })
    .then(() => logger.info('Slash commands added'))
    .catch((error) => logger.exception(error, 'Error in setting up slash commands'));
}
