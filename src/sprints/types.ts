import { GuildMember, Role } from 'discord.js';

export interface ISprint {
  ended: boolean;
  id: string;
  end?(): void;
  addSprinter?(user: GuildMember | Role): void;
  cancel?(canceller: GuildMember): void;
  setStart?(): Promise<void>;
}
