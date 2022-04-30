import {
  ButtonInteraction,
  Client, CommandInteraction, Guild, Intents, Permissions,
} from 'discord.js';
import WoolfServer from './WoolfServer';
import { logger } from '../utils/logger';
import { TOKEN } from '../utils/constants';
import {
  slashCommandsMap, buttonCommandsMap,
} from '../commands';
import { setUpSlashCommands } from '../commands/slashCommands/setup';
import { handleInteractionError } from '../utils/errors';
import { respondToMention } from '../utils/mentions';

type WoolfServerCollection = Map<Guild | null, WoolfServer>;

function commandArgsToString(command: CommandInteraction) {
  const wordArg = command.options.getString('word');
  const startInArg = command.options.getInteger('startin');
  const durationArg = command.options.getInteger('duration');
  if (wordArg) {
    return ` ${wordArg}`;
  }
  if (startInArg != null && durationArg != null) {
    return ` in ${startInArg} for ${durationArg}`;
  }
  return '';
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
      logger.info(`Woolf started. ${this.#connectedServers.size} servers connected!`);
    });

    this.#virginia.on('guildCreate', (guild) => {
      this.createNewServer(guild, true);
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
      const botId = this.#virginia.user?.id;

      if (botId && message.mentions.has(botId, { ignoreRoles: true, ignoreEveryone: true })) {
        respondToMention(message);
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
      logger.info(`/${commandName}${commandArgsToString(interaction)} in ${interaction.guild?.name ?? 'no server'}`);
      await slashCommandsMap
        .get(commandName)?.(interaction, this.#connectedServers.get(interaction.guild));
    } catch (error) {
      handleInteractionError(error, interaction, commandName);
    }
  }

  private async checkServerPermissions(guild: Guild) {
    const botId = this.#virginia.user?.id;
    if (botId) {
      const botMember = await guild.members.fetch(botId);
      const canManageRoles = botMember?.permissions.any(Permissions.FLAGS.MANAGE_ROLES);
      const canSendMessages = botMember?.permissions.any(Permissions.FLAGS.SEND_MESSAGES);
      return canManageRoles && canSendMessages;
    }
    return false;
  }

  private async createNewServer(guild: Guild, logAdded = false) {
    try {
      if (await this.checkServerPermissions(guild)) {
        const newServer = new WoolfServer(guild);
        await newServer.getSprintRole();
        this.#connectedServers.set(guild, newServer);
        if (logAdded) logger.info(`Bot added to ${guild.name}`);
      } else {
        throw new Error('Server does not have correct permissions');
      }
    } catch (error) {
      logger.exception(error, `Error in setting up a WoolfServer instance for ${guild.name}`);
    }
    return this.#connectedServers;
  }
}
