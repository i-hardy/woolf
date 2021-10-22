import { APIInteractionGuildMember } from 'discord-api-types';
import { GuildMember, Role } from 'discord.js';

export interface ISprint {
  ended: boolean;
  id: string;
  end?(): void;
  addSprinter?(user: GuildMember | APIInteractionGuildMember | Role): void;
  cancel?(canceller: GuildMember | APIInteractionGuildMember): void;
  setStart?(): Promise<void>;
}
