import winston from "winston";
import { Loggly } from "winston-loggly-bulk";
import { ENV, LOGGLY_KEY } from "./constants";

const upcaseLevel = winston.format.printf((info) => {
  info.level = info.level.toUpperCase();
  return JSON.stringify(info);
})

const logFormat = winston.format.printf((info) => {
  return `[${info.timestamp}] ${info.level}: ${JSON.stringify(info.message, null, 4)}`;
});

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
    tags: ["Winston-NodeJS"],
  });
}

export const logger = winston.createLogger({
  transports: [
    generateTransport(),
  ]
});
