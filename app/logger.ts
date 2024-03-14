import winston, { format } from "winston";

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}:${message}`;
});

// Create a winston logger instance
const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: format.cli(),
    }), // Logs to the Console
    new winston.transports.File({ filename: "logs.log" }), // Logs to the file
  ],
  format: combine(
    timestamp(),
    myFormat,
    // format.json()
  ),
});

export { logger };
