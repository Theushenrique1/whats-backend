const pino = require("pino");

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: null, // não imprime pid/hostname
    timestamp: pino.stdTimeFunctions.isoTime, // 2025-08-28 20:01:23
  },
  pino.transport({
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  }),
);

module.exports = logger;
