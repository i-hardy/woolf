import {
  ButtonInteraction, Client, CommandInteraction, Guild, Intents, Message, Permissions,
} from 'discord.js';
import WoolfServer from './WoolfServer';
import { logger } from '../utils/logger';
import { TOKEN } from '../utils/constants';
import { COMMAND, INFO, QUOTE } from '../utils/regexes';
import memoize from '../utils/memoize';
import {
  commandsMap, commandsList, slashCommandsMap, buttonCommandsMap,
} from '../commands';
import { commandList } from '../responses.json';
import SprintError from '../sprints/SprintError';
import { setUpSlashCommands } from '../commands/slashCommands/setup';

type WoolfServerCollection = Map<Guild | null, WoolfServer>;

async function respondToMention(message: Message) {
  try {
    await message.channel.send(commandList);
    logger.info(`Command list sent in ${message.guild?.name ?? 'no server'}`);
  } catch (error) {
    message.reply({ content: 'sorry, an error occurred when I tried to do that' }).catch(() => null);
    logger.exception(error, `Error responding to mention in ${message.guild?.name ?? 'no server'}`);
  }
}

function handleInteractionError(
  error: unknown,
  interaction: CommandInteraction | ButtonInteraction,
  attempted: string,
) {
  let errorResponse = 'sorry, an error occurred when I tried to do that';
  if (error instanceof SprintError && error.userMessage) {
    errorResponse = error.userMessage;
  }
  interaction.reply({ content: errorResponse }).catch(() => null);
  logger.exception(error, `Error executing ${attempted} in ${interaction.guild?.name ?? 'no server'}`);
}

export default class Woolf {
  #virginia: Client;

  #connectedServers: WoolfServerCollection;

  constructor(BotClass: typeof Client) {
    this.#connectedServers = new Map<Guild | null, WoolfServer>();
    this.#virginia = new BotClass({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
      ],
    });
  }

  errorEvents(): Woolf {
    this.#virginia.on('error', (error) => {
      logger.exception(error);
    });

    this.#virginia.on('shardError', (error) => {
      logger.exception(error, 'A websocket connection encountered an error:');
    });

    return this;
  }

  guildEvents(): Woolf {
    this.#virginia.on('ready', async () => {
      await Promise.all(this.#virginia.guilds.cache.map(async (guild) => {
        await this.createNewServer(guild);
      }));
      await setUpSlashCommands();
      logger.info(`Woolf started. ${this.#connectedServers.size} servers verified and connected!`);
    });

    this.#virginia.on('guildCreate', (guild) => {
      this.createNewServer(guild);
    });

    this.#virginia.on('guildDelete', (guild) => {
      this.#connectedServers.delete(guild);
      this.#virginia.guilds.cache.delete(guild.id);
    });

    return this;
  }

  messageEvents(): Woolf {
    this.#virginia.on('interactionCreate', async (interaction) => {
      if (interaction.isButton()) {
        try {
          await buttonCommandsMap.get(interaction.customId)?.(
            interaction,
            this.#connectedServers.get(interaction.guild),
          );
        } catch (error) {
          handleInteractionError(error, interaction, interaction.customId);
        }
      }
      if (interaction.isCommand()) {
        const { commandName } = interaction;
        logger.info(`/${commandName} in ${interaction.guild?.name ?? 'no server'}`);
        try {
          await slashCommandsMap
            .get(commandName)?.(interaction, this.#connectedServers.get(interaction.guild));
        } catch (error) {
          handleInteractionError(error, interaction, commandName);
        }
      }
    });

    this.#virginia.on('messageCreate', (message) => {
      if (this.isIgnorable(message.content)) return;
      const botId = this.#virginia.user?.id;

      if (botId && message.mentions.has(botId, { ignoreRoles: true, ignoreEveryone: true })) {
        respondToMention(message);
      } else if (message.content.match(COMMAND)) {
        this.respondToCommand(message);
      }
    });
    return this;
  }

  run(): Woolf {
    this.#virginia.login(TOKEN);
    return this;
  }

  stopGracefully(): Woolf {
    this.#virginia.destroy();
    return this;
  }

  private async respondToCommand(message: Message) {
    const command = this.findCommand(message.content);
    if (command) {
      try {
        logger.info(`${message.content} in ${message.guild?.name ?? 'no server'}`);
        await commandsMap.get(command)?.(message, this.#connectedServers.get(message.guild));
      } catch (error) {
        let errorResponse = 'sorry, an error occurred when I tried to do that';
        if (error instanceof SprintError && error.userMessage) {
          errorResponse = error.userMessage;
        }
        message.reply({ content: errorResponse }).catch(() => null);
        logger.exception(error, `Error executing ${message.content} in ${message.guild?.name ?? 'no server'}`);
      }
    }
  }

  private async checkServerPermissions(guild: Guild) {
    const botId = this.#virginia.user?.id;
    if (botId) {
      const botMember = await guild.members.fetch(botId);
      return botMember?.permissions.any(Permissions.FLAGS.MANAGE_ROLES);
    }
    return false;
  }

  private async createNewServer(guild: Guild) {
    try {
      if (await this.checkServerPermissions(guild)) {
        const newServer = new WoolfServer(guild);
        await newServer.getSprintRole();
        this.#connectedServers.set(guild, newServer);
      }
    } catch (error) {
      logger.exception(error, `Error in setting up a WoolfServer instance for ${guild.name}`);
    }
    return this.#connectedServers;
  }

  /* eslint-disable class-methods-use-this */
  @memoize
  private findCommand(messageContent: string) {
    return commandsList.find((command) => messageContent.match(command));
  }

  @memoize
  private isIgnorable(messageContent: string) {
    return messageContent.match(INFO) || messageContent.match(QUOTE);
  }
}
