import { Guild, Message, Role } from "discord.js";
import memoize from "../utils/memoize";
import Sprint, { ISprint } from "../sprints/Sprint";
import { ROLE_NAME, ROLE_COLOR } from "../utils/constants";

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

  private get canJoinSprint() {
    return !this.#sprint.ended;
  }

  @memoize
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

  async writingSprint(message: Message): Promise<void> {
    if (this.canSprint) { 
      this.#sprint = new Sprint(message);  
      this.#sprint.addSprinter?.(await this.getSprintRole());
      this.#sprint.setStart?.();
    }
  }

  cancelSprint(message: Message): void {
    if (this.canJoinSprint && message.member) {
      this.#sprint.cancel?.(message.member);
    }
  }

  joinSprint(message: Message): void {
    if (this.canJoinSprint && message.member) {
      this.#sprint.addSprinter?.(message.member);
    }
  }

  async receiveSprintRole(message: Message): Promise<void> {
    message.member?.roles.add(await this.getSprintRole());
  }

  async removeSprintRole(message: Message): Promise<void> {
    message.member?.roles.remove(await this.getSprintRole());
  }
}