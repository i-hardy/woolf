import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Guild } from 'discord.js';
import { TOKEN, CLIENT_ID } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { commands } from './commands';

const jsonCommands = commands.map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN);

export function setUpSlashCommandsForGuild(guild: Guild): Promise<unknown> {
  return rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), { body: jsonCommands })
    .then(() => logger.info(`Slash commands added for guild ${guild.name}`))
    .catch((error) => logger.exception(error, `Error in setting up slash commands for guild ${guild.name}`));
}
