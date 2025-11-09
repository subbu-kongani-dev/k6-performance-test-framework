/**
 * Logger utility for k6 performance tests
 * Provides structured logging with different log levels and formatted output
 * @module logger
 */

import { LogLevel } from "../constants";

/**
 * Interface for log entry structure
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

/**
 * Logger class for structured logging in k6 tests
 * @example
 * ```typescript
 * const logger = new Logger('MyTest');
 * logger.info('Test started');
 * logger.error('Test failed', { error: 'Connection timeout' });
 * ```
 */
export class Logger {
  private context: string;
  private logLevel: LogLevel;

  /**
   * Creates a new Logger instance
   * @param context - Context identifier (e.g., test name, module name)
   * @param logLevel - Minimum log level to display (default: INFO)
   */
  constructor(context: string = "K6Test", logLevel: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.logLevel = logLevel;
  }

  /**
   * Gets the current timestamp in ISO format
   * @returns ISO formatted timestamp string
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Determines if a message should be logged based on log level
   * @param level - The log level of the message
   * @returns true if the message should be logged, false otherwise
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Formats and outputs a log entry
   * @param entry - The log entry to format and output
   */
  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const logMessage = `[${entry.timestamp}] [${entry.level}] [${this.context}] ${entry.message}`;
    
    console.log(logMessage);
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log("Context:", JSON.stringify(entry.context, null, 2));
    }
  }

  /**
   * Logs a debug message
   * @param message - The debug message
   * @param context - Optional context object
   */
  public debug(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: this.getTimestamp(),
      context,
    });
  }

  /**
   * Logs an info message
   * @param message - The info message
   * @param context - Optional context object
   */
  public info(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: this.getTimestamp(),
      context,
    });
  }

  /**
   * Logs a warning message
   * @param message - The warning message
   * @param context - Optional context object
   */
  public warn(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: this.getTimestamp(),
      context,
    });
  }

  /**
   * Logs an error message
   * @param message - The error message
   * @param context - Optional context object
   */
  public error(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: this.getTimestamp(),
      context,
    });
  }

  /**
   * Logs a test step with INFO level
   * @param step - The step name/description
   * @param details - Optional step details
   */
  public step(step: string, details?: Record<string, any>): void {
    this.info(`STEP: ${step}`, details);
  }

  /**
   * Logs HTTP request details
   * @param method - HTTP method
   * @param url - Request URL
   * @param statusCode - Response status code
   * @param duration - Request duration in milliseconds
   */
  public logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number
  ): void {
    this.info(`${method} ${url} - Status: ${statusCode} - Duration: ${duration.toFixed(2)}ms`);
  }

  /**
   * Sets the log level dynamically
   * @param level - The new log level to set
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Gets the current log level
   * @returns The current log level
   */
  public getLogLevel(): LogLevel {
    return this.logLevel;
  }
}

/**
 * Default logger instance
 */
export const defaultLogger = new Logger("K6Framework");
