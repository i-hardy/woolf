import {
  ButtonInteraction,
  Client, CommandInteraction, Guild, Intents, Message, Permissions,
} from 'discord.js';
import WoolfServer from './WoolfServer';
import { logger } from '../utils/logger';
import { TOKEN } from '../utils/constants';
import { COMMAND, INFO, QUOTE } from '../utils/regexes';
import memoize from '../utils/memoize';
import {
  commandsMap, commandsList, slashCommandsMap, buttonCommandsMap,
} from '../commands';
import { setUpSlashCommands } from '../commands/slashCommands/setup';
import { handleInteractionError } from '../utils/errors';
import { respondToMention } from '../utils/mentions';

type WoolfServerCollection = Map<Guild | null, WoolfServer>;

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
      logger.info(`Woolf started. ${this.#connectedServers.size} servers connected!`);
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
        this.handleButtonInteraction(interaction);
      } else if (interaction.isCommand()) {
        this.handleCommandInteraction(interaction);
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

  private async handleButtonInteraction(interaction: ButtonInteraction) {
    try {
      logger.info(`Click on ${interaction.customId} in ${interaction.guild?.name ?? 'no server'}`);
      await buttonCommandsMap.get(interaction.customId)?.(
        interaction,
        this.#connectedServers.get(interaction.guild),
      );
    } catch (error) {
      handleInteractionError(error, interaction, interaction.customId);
    }
  }

  private async handleCommandInteraction(interaction: CommandInteraction) {
    const { commandName } = interaction;
    try {
      logger.info(`/${commandName} in ${interaction.guild?.name ?? 'no server'}`);
      await slashCommandsMap
        .get(commandName)?.(interaction, this.#connectedServers.get(interaction.guild));
    } catch (error) {
      handleInteractionError(error, interaction, commandName);
    }
  }

  private async respondToCommand(message: Message) {
    const command = this.findCommand(message.content);
    if (command) {
      try {
        logger.info(`${message.content} in ${message.guild?.name ?? 'no server'}`);
        const deprecationMessage = commandsMap.get(command);
        message.reply(`The **!** command syntax is now deprecated. ${deprecationMessage}`);
      } catch (error) {
        const errorResponse = 'sorry, an error occurred when I tried to do that';
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
