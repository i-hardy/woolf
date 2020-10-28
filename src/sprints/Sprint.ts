import { Message, GuildMember, Role } from 'discord.js';
import UserList from './UserList';
import { SPRINT } from "../utils/regexes";
import { timer } from "../utils/timer";

const MINS_TO_MS = 60000;

export interface ISprint {
  ended: boolean;
  addSprinter?(user: GuildMember | Role): void;
  cancel?(canceller: GuildMember): void;
  setStart?(): Promise<void>;
}

export default class Sprint {
  userList: UserList;
  #ended: boolean;
  #message: Message;
  #owner: GuildMember | null;
  #times?: number[];

  constructor(message: Message) {
    this.#ended = false;
    this.#owner = message?.member;
    this.userList = new UserList();
    this.#message = message;
    this.startAndDuration();
  }

  get ended() {
    return this.#ended;
  }

  private get startIn() {
    return this.#times?.[0];
  }

  private get length() {
    return this.#times?.[1];
  }

  private get minutes() {
    return this.startIn === 1 ? 'minute' : 'minutes';
  }

  addSprinter(user: GuildMember | Role) {
    this.userList.addSprinter(user);
  }

  end() {
    this.#ended = true;
  }

  cancel(canceller: GuildMember) {
    if (this.canCancel(canceller)) {
      this.end();
    }
  }

  async setStart() {
    if (!this.startIn) return;
    this.#message.channel.send(`Get ready to sprint in ${this.startIn} ${this.minutes}`);
    await timer(this.startIn * MINS_TO_MS);
    this.startSprint();
  }

  async startSprint() {
    if (this.ended) return;
    this.#message.channel.send(`${this.userList.userMentions()} ${this.length} minute sprint starts now!`);
    await this.sprint();
    this.endSprint();
  }

  endSprint() {
    if (this.ended) return;
    this.#message.channel.send(`${this.userList.userMentions()} Stop sprinting!`);
    this.end();
  }

  private async sprint() {
    if (!this.length) return;
    return timer(this.length * MINS_TO_MS);
  }

  private startAndDuration() {
    this.#times = this.#message?.content?.match(SPRINT)?.slice(1, 3).map(n => parseInt(n));
  }

  private canCancel(canceller: GuildMember) {
    return canceller === this.#owner || canceller.hasPermission('MANAGE_MESSAGES')
  }
}