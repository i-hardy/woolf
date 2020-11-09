import { Message, GuildMember, Role } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import UserList from './UserList';
import SprintError from './SprintError';
import { logger } from '../utils/logger';
import { SPRINT } from '../utils/regexes';
import { timer } from '../utils/timer';

const MINS_TO_MS = 60000;

export default class Sprint {
  userList: UserList;

  id: string;

  #ended: boolean;

  #message: Message;

  #owner: GuildMember | null;

  #times?: number[];

  constructor(message: Message) {
    this.id = uuidv4();
    this.#ended = false;
    this.#owner = message?.member;
    this.userList = new UserList();
    this.#message = message;
    this.startAndDuration();
  }

  get ended(): boolean {
    return this.#ended;
  }

  private get startIn() {
    return this.#times?.[0] || 0;
  }

  private get length() {
    return this.#times?.[1];
  }

  private get minutes() {
    return this.startIn === 1 ? 'minute' : 'minutes';
  }

  toString(): string {
    return JSON.stringify({
      id: this.id,
      ended: this.ended,
      length: this.length,
    });
  }

  addSprinter(user: GuildMember | Role): void {
    this.userList.addSprinter(user);
  }

  end(): void {
    this.#ended = true;
    logger.info(`End sprint ${this.id}`);
  }

  cancel(canceller: GuildMember): void {
    if (this.canCancel(canceller)) {
      this.end();
    } else {
      throw new SprintError('Canceller is not the sprint owner or admin', this);
    }
  }

  async setStart(): Promise<void> {
    await this.#message.channel.send(
      `${this.userList.userMentions()} Get ready to sprint in ${this.startIn} ${this.minutes}`,
    );
    logger.info(`Announce sprint ${this.id}`);
    await timer(this.startIn * MINS_TO_MS);
    return this.startSprint();
  }

  async startSprint(): Promise<void> {
    if (this.ended) return;
    await this.#message.channel.send(
      `${this.userList.userMentions()} ${this.length} minute sprint starts now!`,
    );
    logger.info(`Start sprint ${this.id}`);
    await this.sprint();
    await this.endSprint();
  }

  async endSprint(): Promise<void> {
    if (this.ended) return;
    await this.#message.channel.send(`${this.userList.userMentions()} Stop sprinting!`);
    this.end();
  }

  private async sprint(): Promise<void> {
    if (!this.length) return;
    await timer(this.length * MINS_TO_MS);
  }

  private startAndDuration(): void {
    this.#times = this.#message?.content?.match(SPRINT)?.slice(1, 3).map((n) => parseInt(n, 10));
  }

  private canCancel(canceller: GuildMember): boolean {
    return canceller === this.#owner || canceller.hasPermission('MANAGE_MESSAGES');
  }
}
