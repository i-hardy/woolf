import { Client, Collection, Guild } from 'discord.js';
import WoolfServer from "./WoolfServer";
import { TOKEN } from "../utils/constants";
import { lookupCommands, sprintCommands } from "../commands";
import { CommandFunction } from '../commands/types';

type WoolfServerCollection = Map<Guild, WoolfServer>
interface WoolfBot {
  run(): void;
  stopGracefully(): void;
}
interface WoolfSetup {
  setCommands(): WoolfBot;
}
interface CommandHandler {
  (commandFn: CommandFunction, command: RegExp): void
}

function setUpServers(guilds: Collection<string, Guild>): WoolfServerCollection {
  return guilds.reduce((guildMap, guild) => {
    guildMap.set(guild, new WoolfServer(guild));
    return guildMap;
  }, new Map());
}

function setSprintCommands(virginia: Client, servers: WoolfServerCollection): CommandHandler {
  return function setSprintCommand(commandFn: CommandFunction, command: RegExp): void {
    virginia.on('message', (message) => {
      if (message.content.match(command) && message.guild) {
        const server = servers.get(message.guild);
        commandFn(message, server);
      }
    })
  }
}

function setLookupCommands(virginia: Client): CommandHandler {
  return function setLookupCommand(commandFn: CommandFunction, command: RegExp) {
    virginia.on('message', (message) => {
      if (command.exec(message.content)) {
        commandFn(message);
      }
    })
  }
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
      sprintCommands.forEach(setSprintCommands(virginia, connectedServers));
      lookupCommands.forEach(setLookupCommands(virginia));
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
