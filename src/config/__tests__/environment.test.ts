import "./setup"; // Mock __ENV
import { Environment, getEnvironmentConfig } from "../environment";

describe("Environment Configuration", () => {
  describe("getEnvironmentConfig", () => {
    it("should return local config when environment is LOCAL", () => {
      const config = getEnvironmentConfig(Environment.LOCAL);
      expect(config.baseUrl).toBe("http://localhost:3000");
      expect(config.timeout).toBe(30000);
      expect(config.logLevel).toBe("DEBUG");
      expect(config.enableMetrics).toBe(true);
    });

    it("should return development config when environment is DEVELOPMENT", () => {
      const config = getEnvironmentConfig(Environment.DEVELOPMENT);
      expect(config.baseUrl).toBe("https://dev-api.example.com");
      expect(config.timeout).toBe(30000);
      expect(config.logLevel).toBe("DEBUG");
      expect(config.enableMetrics).toBe(true);
    });

    it("should return staging config when environment is STAGING", () => {
      const config = getEnvironmentConfig(Environment.STAGING);
      expect(config.baseUrl).toBe("https://staging-api.example.com");
      expect(config.timeout).toBe(30000);
      expect(config.logLevel).toBe("INFO");
      expect(config.enableMetrics).toBe(true);
    });

    it("should return production config when environment is PRODUCTION", () => {
      const config = getEnvironmentConfig(Environment.PRODUCTION);
      expect(config.baseUrl).toBe("https://api.example.com");
      expect(config.timeout).toBe(30000);
      expect(config.logLevel).toBe("WARN");
      expect(config.enableMetrics).toBe(true);
    });

    it("should return development config for undefined environment", () => {
      const config = getEnvironmentConfig(undefined as any);
      // When undefined, getCurrentEnvironment() is called which returns DEVELOPMENT
      expect(config.baseUrl).toBe("https://dev-api.example.com");
      expect(config.name).toBe(Environment.DEVELOPMENT);
    });
  });

  describe("Environment Config Properties", () => {
    it("should have retry configurations for all environments", () => {
      const environments = [Environment.LOCAL, Environment.DEVELOPMENT, Environment.STAGING, Environment.PRODUCTION];

      environments.forEach((env) => {
        const config = getEnvironmentConfig(env);
        expect(config.retryAttempts).toBeGreaterThan(0);
        expect(config.name).toBe(env);
      });
    });

    it("should have timeout for all environments", () => {
      const environments = [Environment.LOCAL, Environment.DEVELOPMENT, Environment.STAGING, Environment.PRODUCTION];

      environments.forEach((env) => {
        const config = getEnvironmentConfig(env);
        expect(config.timeout).toBeGreaterThan(0);
        expect(config.baseUrl).toBeDefined();
      });
    });

    it("should have different log levels for different environments", () => {
      expect(getEnvironmentConfig(Environment.LOCAL).logLevel).toBe("DEBUG");
      expect(getEnvironmentConfig(Environment.DEVELOPMENT).logLevel).toBe("DEBUG");
      expect(getEnvironmentConfig(Environment.STAGING).logLevel).toBe("INFO");
      expect(getEnvironmentConfig(Environment.PRODUCTION).logLevel).toBe("WARN");
    });

    it("should have metrics enabled for all environments", () => {
      expect(getEnvironmentConfig(Environment.LOCAL).enableMetrics).toBe(true);
      expect(getEnvironmentConfig(Environment.DEVELOPMENT).enableMetrics).toBe(true);
      expect(getEnvironmentConfig(Environment.STAGING).enableMetrics).toBe(true);
      expect(getEnvironmentConfig(Environment.PRODUCTION).enableMetrics).toBe(true);
    });
  });
});
