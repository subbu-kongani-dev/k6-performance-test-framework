/**
 * Constants and Enums for k6 Performance Test Framework
 * @module constants
 */

/**
 * HTTP Status Code Ranges
 */
export const HTTP_STATUS = {
  SUCCESS_MIN: 200,
  SUCCESS_MAX: 299,
  CLIENT_ERROR_MIN: 400,
  CLIENT_ERROR_MAX: 499,
  SERVER_ERROR_MIN: 500,
  SERVER_ERROR_MAX: 599,
} as const;

/**
 * Common HTTP Status Codes
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * HTTP Methods
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

/**
 * Content Types
 */
export enum ContentType {
  JSON = "application/json",
  XML = "application/xml",
  FORM_DATA = "multipart/form-data",
  URL_ENCODED = "application/x-www-form-urlencoded",
  TEXT = "text/plain",
}

/**
 * Log Levels
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Test Type Identifiers
 */
export enum TestType {
  SMOKE = "smoke",
  LOAD = "load",
  STRESS = "stress",
  SPIKE = "spike",
  SOAK = "soak",
}

/**
 * Default Performance Thresholds (in milliseconds)
 */
export const PERFORMANCE_THRESHOLDS = {
  FAST: 100,
  NORMAL: 500,
  SLOW: 1000,
  VERY_SLOW: 2000,
} as const;

/**
 * Default Test Configuration
 */
export const DEFAULT_TEST_CONFIG = {
  SLEEP_DURATION: 1, // seconds
  THINK_TIME: 0.5, // seconds
  REQUEST_TIMEOUT: 30000, // milliseconds
  MAX_REDIRECTS: 10,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  INVALID_URL: "Invalid URL format provided",
  INVALID_STATUS_CODE: "Invalid HTTP status code",
  MISSING_REQUIRED_FIELD: "Required field is missing",
  INVALID_JSON: "Invalid JSON format",
  THRESHOLD_EXCEEDED: "Performance threshold exceeded",
  EMPTY_RESPONSE: "Response body is empty",
  NETWORK_ERROR: "Network error occurred",
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  REQUEST_SUCCESSFUL: "Request completed successfully",
  VALIDATION_PASSED: "Validation passed",
  THRESHOLD_MET: "Performance threshold met",
} as const;

/**
 * Environment Variables
 */
export const ENV_VARS = {
  BASE_URL: "BASE_URL",
  ENVIRONMENT: "ENVIRONMENT",
  LOG_LEVEL: "LOG_LEVEL",
  K6_CLOUD_TOKEN: "K6_CLOUD_TOKEN",
} as const;
