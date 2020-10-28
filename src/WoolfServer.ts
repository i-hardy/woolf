import { Guild, Message, Role } from "discord.js";
import Sprint, { ISprint } from "./sprints/Sprint";
import { ROLE_NAME, ROLE_COLOR } from "./utils/constants";

function roleByName(role: Role) {
  return role.name === ROLE_NAME;
}

export default class WoolfServer {
  guild: Guild;
  #sprint: ISprint;

  constructor(guild: Guild) {
    this.guild = guild;
    this.#sprint = { ended: true };
  }

  private get canSprint() {
    return this.#sprint.ended;
  }

  // TODO: memoize this
  async getSprintRole(): Promise<Role> {
    const existingRole = this.guild.roles.cache.find(roleByName);
    if (existingRole) {
      return existingRole;
    } else {
      return this.guild.roles.create({
        data: {
          name: ROLE_NAME,
          color: ROLE_COLOR,
          mentionable: true,
        }
      })
    }
  }

  async writingSprint(message: Message) {
    if (this.canSprint) { 
      this.#sprint = new Sprint(message);  
      this.#sprint.addSprinter?.(await this.getSprintRole());
      this.#sprint.setStart?.();
    }
  }

  cancelSprint(message: Message) {
    if (this.canSprint && message.member) {
      this.#sprint.cancel?.(message.member);
    }
  }

  joinSprint(message: Message) {
    if (this.canSprint && message.member) {
      this.#sprint.addSprinter?.(message.member);
    }
  }

  async receiveSprintRole(message: Message) {
    message.member?.roles.add(await this.getSprintRole());
  }

  async removeSprintRole(message: Message) {
    message.member?.roles.remove(await this.getSprintRole());
  }
}