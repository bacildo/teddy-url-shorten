import { createLogger, format, transports } from 'winston';

const customFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  }),
);

const logger = createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

export const customLogger = {
  log: (message: string) => logger.info(message),
  error: (message: string) => logger.error(message),
  warn: (message: string) => logger.warn(message),
  debug: (message: string) => logger.debug(message),
};
