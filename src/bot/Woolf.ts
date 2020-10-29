import { Client, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "../utils/constants";
import { COMMAND } from "../utils/regexes";
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
  
  guildEvents(): Woolf {
    this.#virginia.on('ready', () => {
      this.#virginia.guilds.cache.forEach(this.createNewServer.bind(this));
      console.log(`${this.#connectedServers.size} servers connected!`);
    });

    this.#virginia.on('guildCreate', (guild) => {
      this.createNewServer(guild);
    });
  
    this.#virginia.on('guildDelete', (guild) => {
      this.#connectedServers.delete(guild);
    });

    return this;
  }

  setCommands(): Woolf {
    this.#virginia.on('message', (message) => {
      const botId = this.#virginia.user?.id;
      if (botId && message.mentions.has(botId)) {
        message.channel.send(commandList);
      } else if (message.content.match(COMMAND)) {          
        const command = this.findCommand(message.content);          
        if (command) {
          commandsMap.get(command)?.(message, this.#connectedServers.get(message.guild));
        }
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

  private createNewServer(guild: Guild) {
    this.#connectedServers.set(guild, new WoolfServer(guild));
    return this.#connectedServers;
  }

  @memoize
  private findCommand(messageContent: string) {
    return commandsList.find((command) => messageContent.match(command));
  }
}
