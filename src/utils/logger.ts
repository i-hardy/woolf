import { DiscordAPIError } from 'discord.js';
import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import { ENV, LOGGLY_KEY } from './constants';
import SprintError from '../sprints/SprintError';

const upcaseLevel = winston.format.printf(
  (info) => JSON.stringify({ ...info, level: info.level.toUpperCase() }),
);

const logFormat = winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${JSON.stringify(info.message, null, 4)}`);

function generateTransport() {
  if (ENV === 'development' || !LOGGLY_KEY) {
    return new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        upcaseLevel,
        winston.format.timestamp(),
        winston.format.colorize(),
        logFormat,
      ),
    });
  }
  return new Loggly({
    subdomain: 'woolf',
    token: LOGGLY_KEY,
    json: true,
    tags: ['Winston-NodeJS'],
  });
}

type LoggableError = Error | SprintError | DiscordAPIError;

export interface BetterLogger extends winston.Logger {
  exception: (error: LoggableError, prefix?: string) => BetterLogger;
}

export const logger: BetterLogger = winston.createLogger({
  level: 'info',
  transports: [
    generateTransport(),
  ],
}) as BetterLogger;

function exceptionMessage(error: LoggableError) {
  if (error instanceof DiscordAPIError) {
    const {
      message, stack, path, code, method,
    } = error;
    return `${message}, stack: ${stack}, path: ${path}, code: ${code}, method: ${method}`;
  }
  if (error instanceof SprintError) {
    const { message, stack, sprint } = error;
    return `${message}, stack: ${stack}, sprint: ${JSON.stringify(sprint)}`;
  }
  const { message, stack } = error;
  return `${message}, stack: ${stack}}`;
}

// Monkey patching Winston because it incorrectly logs `Error` instances even in 2020
// Related issue: https://github.com/winstonjs/winston/issues/1498
logger.exception = function exception(error, prefix = '') {
  return this.error(`${prefix} ${exceptionMessage(error)}`) as BetterLogger;
};
