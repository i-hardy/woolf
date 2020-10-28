import { Client, Collection, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "./utils/constants";
import { SPRINT } from "./utils/regexes";

function setUpServers(guilds: Collection<any, Guild>) {
  return guilds.reduce((guildMap, guild) => {
    guildMap.set(guild, new WoolfServer(guild));
    return guildMap;
  }, new Map());
}

export default class Woolf {
  connectedServers: Map<Guild, WoolfServer>;
  virginia: Client;

  constructor(BotClass: typeof Client) {
    this.connectedServers = new Map();
    this.virginia = new BotClass()
    this.virginia.on('ready', () => {
      this.connectedServers = setUpServers(this.virginia.guilds.cache)
      console.log(`${this.connectedServers.size} servers connected!`);
    });

    this.virginia.on('message', (message) => {
      if (message.content?.match(SPRINT) && message.guild) {        
        const sendTo = this.connectedServers.get(message.guild);        
        sendTo?.writingSprint(message);
      }
    });
  }

  run(){
    this.virginia.login(TOKEN);
  }

  stopGracefully() {
    this.virginia.destroy();
  }
}