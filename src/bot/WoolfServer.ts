/* eslint-disable class-methods-use-this */
import {
  ButtonInteraction,
  CommandInteraction,
  Guild, GuildMemberRoleManager, Role,
} from 'discord.js';
import {
  addRole, removeRole, cancelSprint, joinSprint,
} from '../responses.json';
import memoize from '../utils/memoize';
import Sprint from '../sprints/Sprint';
import { ISprint } from '../sprints/types';
import SprintError from '../sprints/SprintError';
import { ENV, ROLE_NAME, ROLE_COLOR } from '../utils/constants';

const BOT_NAME = ENV === 'development' ? 'testing-bot' : 'woolf';

function roleByName(role: Role) {
  return role.name === ROLE_NAME;
}

export default class WoolfServer {
  guild: Guild;

  #sprint: ISprint;

  constructor(guild: Guild) {
    this.guild = guild;
    this.#sprint = { ended: true, id: 'default sprint' };
  }

  private get rolePosition() {
    const woolfRole = this.guild.roles.cache.find((role) => role.name === BOT_NAME);
    return (woolfRole?.position || 2) - 1;
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
    }
    return this.guild.roles.create({
      name: ROLE_NAME,
      color: ROLE_COLOR,
      mentionable: true,
      position: this.rolePosition,
    });
  }

  async writingSprint(message: CommandInteraction, times: number[]): Promise<void> {
    if (this.canSprint) {
      try {
        this.#sprint = new Sprint(message, times);
        this.#sprint.addSprinter?.(await this.getSprintRole());
        await this.#sprint.setStart?.();
      } catch (error) {
        this.#sprint.end?.();
        throw error;
      }
    } else {
      throw new SprintError(
        'Existing sprint has not ended',
        this.#sprint,
        'the current sprint has not ended yet',
      );
    }
  }

  async cancelSprint(message: CommandInteraction): Promise<void> {
    if (this.canJoinSprint && message.member) {
      this.#sprint.cancel?.(message?.member);
      await message.reply({ content: cancelSprint });
    } else {
      throw new SprintError(
        'No cancellable sprint',
        this.#sprint,
        'there is no sprint to be cancelled',
      );
    }
  }

  async cancelSprintButton(interaction: ButtonInteraction): Promise<void> {
    if (this.canJoinSprint && interaction.member) {
      this.#sprint.cancel?.(interaction.member);
      await interaction.reply({ content: `${interaction.member.toString()} ${cancelSprint}` });
    }
  }

  async joinSprintButton(interaction: ButtonInteraction): Promise<void> {
    if (this.canJoinSprint && interaction.member) {
      this.#sprint.addSprinter?.(interaction.member);
      await interaction.reply({ content: `${interaction.member.toString()} ${joinSprint}` });
    }
  }

  async receiveSprintRole(message: CommandInteraction): Promise<void> {
    if (message.member?.roles instanceof GuildMemberRoleManager) {
      await message.member?.roles.add?.(await this.getSprintRole());
      await message.reply({ content: addRole });
    }
  }

  async removeSprintRole(message: CommandInteraction): Promise<void> {
    if (message.member?.roles instanceof GuildMemberRoleManager) {
      await message.member?.roles.remove(await this.getSprintRole());
      await message.reply({ content: removeRole });
    }
  }
}
