interface Mentionable {
  toString(): string
}

export default class UserList {
  list: Mentionable[]

  constructor() {
    this.list = []
  }

  addSprinter(user: Mentionable): void {
    this.list.push(user);
  }

  userMentions(): string {
    return this.list.map(user => user.toString()).join(' ')
  }
}