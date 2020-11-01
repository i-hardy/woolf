import { ISprint } from "./Sprint";

export default class SprintError extends Error {
  sprint: ISprint;

  constructor(message: string, sprint: ISprint) {
    super(message);
    this.sprint = sprint;
  }
}