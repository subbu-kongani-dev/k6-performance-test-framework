/**
 * Environment Configuration Management
 * Supports multiple environments (dev, staging, production)
 * @module environment
 */

import { ENV_VARS } from "../constants";

/**
 * Environment types supported by the framework
 */
export enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
  LOCAL = "local",
}

/**
 * Interface for environment-specific configuration
 */
export interface EnvironmentConfig {
  name: Environment;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  logLevel: string;
  enableMetrics: boolean;
  apiKey?: string;
  customHeaders?: Record<string, string>;
}

/**
 * Environment configurations for different deployment stages
 */
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  [Environment.LOCAL]: {
    name: Environment.LOCAL,
    baseUrl: "http://localhost:3000",
    timeout: 30000,
    retryAttempts: 1,
    logLevel: "DEBUG",
    enableMetrics: true,
  },
  [Environment.DEVELOPMENT]: {
    name: Environment.DEVELOPMENT,
    baseUrl: "https://dev-api.example.com",
    timeout: 30000,
    retryAttempts: 2,
    logLevel: "DEBUG",
    enableMetrics: true,
  },
  [Environment.STAGING]: {
    name: Environment.STAGING,
    baseUrl: "https://staging-api.example.com",
    timeout: 30000,
    retryAttempts: 3,
    logLevel: "INFO",
    enableMetrics: true,
  },
  [Environment.PRODUCTION]: {
    name: Environment.PRODUCTION,
    baseUrl: "https://api.example.com",
    timeout: 30000,
    retryAttempts: 3,
    logLevel: "WARN",
    enableMetrics: true,
  },
};

/**
 * Gets the current environment from environment variable or defaults to development
 * @returns The current environment
 */
export function getCurrentEnvironment(): Environment {
  const envString = __ENV[ENV_VARS.ENVIRONMENT] || "development";
  return (envString as Environment) || Environment.DEVELOPMENT;
}

/**
 * Gets the configuration for the current environment
 * @param env - Optional environment override
 * @returns Environment-specific configuration
 */
export function getEnvironmentConfig(env?: Environment): EnvironmentConfig {
  const currentEnv = env || getCurrentEnvironment();
  const config = environmentConfigs[currentEnv];

  // Override with environment variables if provided
  if (__ENV[ENV_VARS.BASE_URL]) {
    config.baseUrl = __ENV[ENV_VARS.BASE_URL];
  }

  if (__ENV[ENV_VARS.LOG_LEVEL]) {
    config.logLevel = __ENV[ENV_VARS.LOG_LEVEL];
  }

  return config;
}

/**
 * Validates if a given string is a valid environment
 * @param env - The environment string to validate
 * @returns true if valid environment, false otherwise
 */
export function isValidEnvironment(env: string): env is Environment {
  return Object.values(Environment).includes(env as Environment);
}

/**
 * Gets the base URL for the current environment
 * @returns The base URL string
 */
export function getBaseUrl(): string {
  return getEnvironmentConfig().baseUrl;
}

/**
 * Checks if the current environment is production
 * @returns true if production environment, false otherwise
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === Environment.PRODUCTION;
}

/**
 * Checks if the current environment is development
 * @returns true if development environment, false otherwise
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === Environment.DEVELOPMENT;
}
