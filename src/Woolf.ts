import { Client, Collection, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "./utils/constants";
import { SPRINT } from "./utils/regexes";
import { sprintCommands } from "./utils/commands";

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

  setCommands() {
    sprintCommands.forEach((commandFn, command) => {
      this.virginia.on('message', (message) => {
        if (message.content.match(command) && message.guild) {
          const server = this.connectedServers.get(message.guild);
          commandFn(message, server);
        }
      })
    });
    return this;
  }

  run(){
    this.virginia.login(TOKEN);
  }

  stopGracefully() {
    this.virginia.destroy();
  }
}