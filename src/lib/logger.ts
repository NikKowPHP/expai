// src/lib/logger.ts

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  error(message: string, ...args: never[]) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  warn(message: string, ...args: never[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  info(message: string, ...args: never[]) {
    console.info(`[INFO] ${message}`, ...args);
  }

  debug(message: string, ...args: never[]) {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
}

const logger = Logger.getInstance();
export default logger;
