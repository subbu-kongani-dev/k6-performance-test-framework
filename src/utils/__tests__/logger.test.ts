/**
 * Unit tests for Logger utility
 */

import { Logger } from "../logger";
import { LogLevel } from "../../constants";

describe("Logger", () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger("TestContext");
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("Constructor", () => {
    it("should create logger with default context and log level", () => {
      const defaultLogger = new Logger();
      expect(defaultLogger.getLogLevel()).toBe(LogLevel.INFO);
    });

    it("should create logger with custom context and log level", () => {
      const customLogger = new Logger("Custom", LogLevel.DEBUG);
      expect(customLogger.getLogLevel()).toBe(LogLevel.DEBUG);
    });
  });

  describe("Log Level Management", () => {
    it("should set and get log level", () => {
      logger.setLogLevel(LogLevel.ERROR);
      expect(logger.getLogLevel()).toBe(LogLevel.ERROR);
    });

    it("should only log messages at or above current log level", () => {
      logger.setLogLevel(LogLevel.WARN);

      logger.debug("Debug message");
      logger.info("Info message");
      logger.warn("Warn message");
      logger.error("Error message");

      // Only WARN and ERROR should be logged
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("Logging Methods", () => {
    it("should log debug messages with context", () => {
      logger.debug("Debug test", { key: "value" });
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain("[DEBUG]");
      expect(logCall).toContain("Debug test");
    });

    it("should log info messages", () => {
      logger.info("Info test");
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain("[INFO]");
      expect(logCall).toContain("Info test");
    });

    it("should log warning messages", () => {
      logger.warn("Warning test");
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain("[WARN]");
      expect(logCall).toContain("Warning test");
    });

    it("should log error messages", () => {
      logger.error("Error test");
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain("[ERROR]");
      expect(logCall).toContain("Error test");
    });
  });

  describe("Special Logging Methods", () => {
    it("should log test steps", () => {
      logger.step("Test Step 1", { detail: "info" });
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain("STEP: Test Step 1");
    });

    it("should log HTTP requests", () => {
      logger.logRequest("GET", "https://api.example.com", 200, 150.5);
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain("GET");
      expect(logCall).toContain("https://api.example.com");
      expect(logCall).toContain("200");
      expect(logCall).toContain("150.50ms");
    });
  });

  describe("Context Logging", () => {
    it("should log additional context when provided", () => {
      logger.info("Message with context", { userId: 123, action: "create" });
      expect(consoleLogSpy).toHaveBeenCalledTimes(2); // Message + Context
      expect(consoleLogSpy.mock.calls[1][0]).toBe("Context:");
    });

    it("should not log context when empty object provided", () => {
      logger.info("Message without context", {});
      expect(consoleLogSpy).toHaveBeenCalledTimes(1); // Only message
    });
  });
});
