import { Client, Collection, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "../utils/constants";
import { commandsMap, commandsList } from "../commands";

type WoolfServerCollection = Map<Guild, WoolfServer>
interface WoolfBot {
  run(): void;
  stopGracefully(): void;
}
interface WoolfSetup {
  setCommands(): WoolfBot;
}

function setUpServers(guilds: Collection<string, Guild>): WoolfServerCollection {
  return guilds.reduce((guildMap, guild) => {
    guildMap.set(guild, new WoolfServer(guild));
    return guildMap;
  }, new Map());
}

export default function Woolf(BotClass: typeof Client): WoolfSetup {
  let connectedServers = new Map();
  const virginia = new BotClass();
  virginia.on('ready', () => {
    connectedServers = setUpServers(virginia.guilds.cache)
    console.log(`${connectedServers.size} servers connected!`);
  });

  return {
    setCommands() {
      virginia.on('message', (message) => {
        const command = commandsList.find((command) => message.content.match(command));
        if (command) {
          commandsMap.get(command)?.(message, connectedServers.get(message.guild));
        }
      });
      return {
        run() {
          virginia.login(TOKEN)
        },
        stopGracefully(): void {
          virginia.destroy();
        }
      };
    }
  }
}
