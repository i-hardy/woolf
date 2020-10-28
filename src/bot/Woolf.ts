import { Client, Collection, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "../utils/constants";
import { lookupCommands, sprintCommands } from "../commands";

type WoolfServerCollection = Map<Guild, WoolfServer>

function setUpServers(guilds: Collection<string, Guild>): WoolfServerCollection {
  return guilds.reduce((guildMap, guild) => {
    guildMap.set(guild, new WoolfServer(guild));
    return guildMap;
  }, new Map());
}

export default class Woolf {
  connectedServers: WoolfServerCollection;
  virginia: Client;

  constructor(BotClass: typeof Client) {
    this.connectedServers = new Map();
    this.virginia = new BotClass()
    this.virginia.on('ready', () => {
      this.connectedServers = setUpServers(this.virginia.guilds.cache)
      console.log(`${this.connectedServers.size} servers connected!`);
    });
  }

  setCommands(): Woolf {
    sprintCommands.forEach((commandFn, command) => {
      this.virginia.on('message', (message) => {
        if (message.content.match(command) && message.guild) {
          const server = this.connectedServers.get(message.guild);
          commandFn(message, server);
        }
      })
    });
    lookupCommands.forEach((commandFn, command) => {
      this.virginia.on('message', (message) => {
        if (command.exec(message.content)) {
          commandFn(message);
        }
      })
    });
    return this;
  }

  run(): void {
    this.virginia.login(TOKEN);
  }

  stopGracefully(): void {
    this.virginia.destroy();
  }
}