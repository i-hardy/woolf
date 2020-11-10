import { ISprint } from './types';

export default class SprintError extends Error {
  sprint: ISprint;

  userMessage: string;

  constructor(message: string, sprint: ISprint, userMessage = '') {
    super(message);
    this.sprint = sprint;
    this.userMessage = userMessage;
  }
}
