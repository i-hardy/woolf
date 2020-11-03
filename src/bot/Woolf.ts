import { Client, Guild, Message } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { logger } from "../utils/logger";
import { TOKEN } from "../utils/constants";
import { COMMAND, INFO, QUOTE } from "../utils/regexes";
import memoize from "../utils/memoize";
import { commandsMap, commandsList } from "../commands";
import { commandList } from "../responses.json";

type WoolfServerCollection = Map<Guild | null, WoolfServer>

export default class Woolf {
  #virginia: Client;
  #connectedServers: WoolfServerCollection;

  constructor(BotClass: typeof Client) {
    this.#connectedServers = new Map<Guild | null, WoolfServer>();
    this.#virginia = new BotClass();
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
    this.#virginia.on('message', (message) => {
      if (this.isIgnorable(message.content)) return;
      const botId = this.#virginia.user?.id;
      if (botId && message.mentions.has(botId, { ignoreRoles: true, ignoreEveryone: true })) {
        this.respondToMention(message);
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

  private async respondToMention(message: Message) {
    try {
      await message.channel.send(commandList);
      logger.info(`Command list sent in ${message.guild?.name ?? 'no server'}`);
    } catch (error) {
      message.reply("sorry, an error occurred when I tried to do that").catch(() => null);
      logger.exception(error, `Error responding to mention in ${message.guild?.name ?? 'no server'}`);
    }
  }

  private async respondToCommand(message: Message) {
    const command = this.findCommand(message.content);          
    if (command) {
      try {
        await commandsMap.get(command)?.(message, this.#connectedServers.get(message.guild));
        logger.info(`${message.content} in ${message.guild?.name ?? 'no server'}`);
      } catch (error) {
        message.reply("sorry, an error occurred when I tried to do that").catch(() => null);
        logger.exception(error, `Error executing ${message.content} in ${message.guild?.name ?? 'no server'}`);
      }
    }
  }

  private checkServerPermissions(guild: Guild) {
    const botId = this.#virginia.user?.id;
    if (botId) {
      const botMember = guild.member(botId);
      return botMember?.permissions.has('MANAGE_ROLES');
    }
    return false;
  }

  private async createNewServer(guild: Guild) {
    try {
      if (this.checkServerPermissions(guild)) {
        const newServer = new WoolfServer(guild);
        await newServer.getSprintRole();
        this.#connectedServers.set(guild, newServer);
      }
    } catch (error) {
      logger.exception(error, `Error in setting up a WoolfServer instance for ${guild.name}`);
    }
    return this.#connectedServers;
  }

  @memoize
  private findCommand(messageContent: string) {
    return commandsList.find((command) => messageContent.match(command));
  }

  @memoize
  private isIgnorable(messageContent: string) {
    return messageContent.match(INFO) || messageContent.match(QUOTE);
  }
}
