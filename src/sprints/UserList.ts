import { GuildMember, Role } from "discord.js";

interface IMentionable {
  toString(): string
}

export default class UserList {
  list: IMentionable[]

  constructor() {
    this.list = []
  }

  addSprinter(user: IMentionable) {
    this.list.push(user);
  }

  userMentions() {
    return this.list.map(user => user.toString()).join(' ')
  }
}