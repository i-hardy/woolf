import { Client, Collection, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "../utils/constants";
import { commandsMap, commandsList } from "../commands";
import { commandList } from "../responses.json";

type WoolfServerCollection = Collection<Guild | null, WoolfServer>
interface WoolfBot {
  run(): void;
  stopGracefully(): void;
}
interface WoolfSetup {
  setCommands(): WoolfBot;
}

function createNewServer(guildMap: WoolfServerCollection, guild: Guild) {
  guildMap.set(guild, new WoolfServer(guild));
  return guildMap;
}

export default function Woolf(BotClass: typeof Client): WoolfSetup {
  const connectedServers = new Collection<Guild | null, WoolfServer>();
  const virginia = new BotClass();
  const virginiaId = virginia.user?.id;

  virginia.on('ready', () => {
    virginia.guilds.cache.reduce(createNewServer, connectedServers);
    console.log(`${connectedServers.size} servers connected!`);
  });

  virginia.on('guildCreate', (guild) => {
    createNewServer(connectedServers, guild);
  });

  virginia.on('guildDelete', (guild) => {
    connectedServers.delete(guild);
  });

  return {
    setCommands() {
      virginia.on('message', (message) => {
        if (virginiaId && message.mentions.has(virginiaId)) {
          message.channel.send(commandList);
        } else {          
          const command = commandsList.find((command) => message.content.match(command));          
          if (command) {
            commandsMap.get(command)?.(message, connectedServers.get(message.guild));
          }
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
