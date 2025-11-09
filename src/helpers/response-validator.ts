import { HTTP_STATUS, HttpStatusCode, ERROR_MESSAGES } from "../constants";
import { Logger } from "../utils/logger";

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  details?: any;
}

/**
 * ResponseValidator class provides comprehensive static methods to validate HTTP responses.
 * Includes methods to check status codes, validate response structure, and ensure performance thresholds.
 * 
 * @module response-validator
 * @example
 * ```typescript
 * const isSuccess = ResponseValidator.isSuccessful(200); // true
 * const validation = ResponseValidator.hasRequiredFields(data, ['id', 'name']);
 * ```
 */
export class ResponseValidator {
  private static logger = new Logger("ResponseValidator");

  /**
   * Checks if the response status code indicates a successful request (2xx)
   * @param statusCode - The HTTP status code to validate
   * @returns true if status code is in the 2xx range, false otherwise
   */
  static isSuccessful(statusCode: number): boolean {
    return statusCode >= HTTP_STATUS.SUCCESS_MIN && statusCode <= HTTP_STATUS.SUCCESS_MAX;
  }

  /**
   * Checks if the status code is a client error (4xx)
   * @param statusCode - The HTTP status code to validate
   * @returns true if status code is in the 4xx range, false otherwise
   */
  static isClientError(statusCode: number): boolean {
    return statusCode >= HTTP_STATUS.CLIENT_ERROR_MIN && statusCode <= HTTP_STATUS.CLIENT_ERROR_MAX;
  }

  /**
   * Checks if the status code is a server error (5xx)
   * @param statusCode - The HTTP status code to validate
   * @returns true if status code is in the 5xx range, false otherwise
   */
  static isServerError(statusCode: number): boolean {
    return statusCode >= HTTP_STATUS.SERVER_ERROR_MIN && statusCode <= HTTP_STATUS.SERVER_ERROR_MAX;
  }

  /**
   * Validates if the status code matches an expected value
   * @param statusCode - The actual HTTP status code
   * @param expectedCode - The expected HTTP status code
   * @returns true if status codes match, false otherwise
   */
  static hasExpectedStatus(statusCode: number, expectedCode: HttpStatusCode | number): boolean {
    return statusCode === expectedCode;
  }

  /**
   * Checks if the response contains the expected fields (renamed from hasRequestFields)
   * @param response - The response object to validate
   * @param fields - Array of required field names
   * @returns Object with validation status and array of missing fields
   */
  static hasRequiredFields(
    response: any,
    fields: string[]
  ): { valid: boolean; missing: string[] } {
    if (typeof response !== "object" || response === null) {
      this.logger.warn(ERROR_MESSAGES.INVALID_JSON);
      return { valid: false, missing: fields };
    }

    const missingFields = fields.filter((field) => !(field in response));
    
    if (missingFields.length > 0) {
      this.logger.warn(ERROR_MESSAGES.MISSING_REQUIRED_FIELD, { missingFields });
    }

    return { valid: missingFields.length === 0, missing: missingFields };
  }

  /**
   * Backward compatibility alias for hasRequiredFields
   * @deprecated Use hasRequiredFields instead
   */
  static hasRequestFields(
    response: any,
    fields: string[]
  ): { valid: boolean; missing: string[] } {
    return this.hasRequiredFields(response, fields);
  }

  /**
   * Validates if all required fields exist and are not null/undefined
   * @param response - The response object to validate
   * @param fields - Array of required field names
   * @returns Detailed validation result
   */
  static validateRequiredFields(
    response: any,
    fields: string[]
  ): ValidationResult {
    if (typeof response !== "object" || response === null) {
      return {
        valid: false,
        message: ERROR_MESSAGES.INVALID_JSON,
        details: { expectedFields: fields },
      };
    }

    const missingFields: string[] = [];
    const nullFields: string[] = [];

    fields.forEach((field) => {
      if (!(field in response)) {
        missingFields.push(field);
      } else if (response[field] === null || response[field] === undefined) {
        nullFields.push(field);
      }
    });

    const isValid = missingFields.length === 0 && nullFields.length === 0;

    return {
      valid: isValid,
      message: isValid ? "All required fields present and valid" : ERROR_MESSAGES.MISSING_REQUIRED_FIELD,
      details: { missingFields, nullFields },
    };
  }

  /**
   * Checks if the response body is valid JSON
   * @param response - The response string to validate
   * @returns true if the string is valid JSON, false otherwise
   */
  static isValidJson(response: string): boolean {
    if (!response || response.trim() === "") {
      this.logger.warn(ERROR_MESSAGES.EMPTY_RESPONSE);
      return false;
    }

    try {
      JSON.parse(response);
      return true;
    } catch (error) {
      this.logger.warn(ERROR_MESSAGES.INVALID_JSON, { error });
      return false;
    }
  }

  /**
   * Backward compatibility alias for isValidJson
   * @deprecated Use isValidJson instead (fixed typo in method name)
   */
  static isvalidJson(response: string): boolean {
    return this.isValidJson(response);
  }

  /**
   * Parses JSON response safely
   * @param response - The response string to parse
   * @returns Parsed object or null if parsing fails
   */
  static parseJsonSafely<T = any>(response: string): T | null {
    try {
      return JSON.parse(response) as T;
    } catch (error) {
      this.logger.error("Failed to parse JSON", { error });
      return null;
    }
  }

  /**
   * Checks if the response time meets the defined performance thresholds
   * @param responseTime - The actual response time in milliseconds
   * @param threshold - The maximum acceptable response time in milliseconds
   * @returns true if response time is within threshold, false otherwise
   */
  static meetsPerformanceThresholds(
    responseTime: number,
    threshold: number
  ): boolean {
    if (responseTime < 0 || threshold < 0) {
      this.logger.error("Invalid response time or threshold values", {
        responseTime,
        threshold,
      });
      return false;
    }

    const meetsThreshold = responseTime <= threshold;
    
    if (!meetsThreshold) {
      this.logger.warn(ERROR_MESSAGES.THRESHOLD_EXCEEDED, {
        responseTime,
        threshold,
        exceeded: responseTime - threshold,
      });
    }

    return meetsThreshold;
  }

  /**
   * Validates response body is not empty
   * @param body - The response body to validate
   * @returns true if body is not empty, false otherwise
   */
  static hasResponseBody(body: any): boolean {
    if (body === null || body === undefined) {
      return false;
    }

    if (typeof body === "string" && body.trim() === "") {
      return false;
    }

    if (typeof body === "object" && Object.keys(body).length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Validates that a response field matches expected type
   * @param response - The response object
   * @param field - The field name to validate
   * @param expectedType - The expected type (e.g., 'string', 'number', 'object')
   * @returns true if field exists and matches expected type
   */
  static hasExpectedType(
    response: any,
    field: string,
    expectedType: string
  ): boolean {
    if (!(field in response)) {
      this.logger.warn(`Field '${field}' not found in response`);
      return false;
    }

    const actualType = Array.isArray(response[field])
      ? "array"
      : typeof response[field];

    if (actualType !== expectedType) {
      this.logger.warn(
        `Type mismatch for field '${field}': expected ${expectedType}, got ${actualType}`
      );
      return false;
    }

    return true;
  }

  /**
   * Validates response against a schema object
   * @param response - The response object to validate
   * @param schema - Schema object with field names and expected types
   * @returns Detailed validation result
   */
  static validateSchema(
    response: any,
    schema: Record<string, string>
  ): ValidationResult {
    const errors: string[] = [];

    Object.entries(schema).forEach(([field, expectedType]) => {
      if (!this.hasExpectedType(response, field, expectedType)) {
        errors.push(`Field '${field}' validation failed`);
      }
    });

    return {
      valid: errors.length === 0,
      message: errors.length === 0 ? "Schema validation passed" : "Schema validation failed",
      details: { errors },
    };
  }

  /**
   * Validates that an array response has expected minimum length
   * @param response - The array response
   * @param minLength - Minimum expected length
   * @returns true if array meets minimum length requirement
   */
  static hasMinLength(response: any[], minLength: number): boolean {
    if (!Array.isArray(response)) {
      this.logger.warn("Response is not an array");
      return false;
    }

    return response.length >= minLength;
  }

  /**
   * Comprehensive response validation
   * @param statusCode - The HTTP status code
   * @param body - The response body
   * @param requiredFields - Optional array of required field names
   * @param maxDuration - Optional maximum response duration in milliseconds
   * @returns Detailed validation result
   */
  static validateResponse(
    statusCode: number,
    body: any,
    requiredFields?: string[],
    maxDuration?: number
  ): ValidationResult {
    const errors: string[] = [];

    // Validate status code
    if (!this.isSuccessful(statusCode)) {
      errors.push(`Invalid status code: ${statusCode}`);
    }

    // Validate body exists
    if (!this.hasResponseBody(body)) {
      errors.push(ERROR_MESSAGES.EMPTY_RESPONSE);
    }

    // Validate required fields if specified
    if (requiredFields && requiredFields.length > 0) {
      const fieldValidation = this.hasRequiredFields(body, requiredFields);
      if (!fieldValidation.valid) {
        errors.push(
          `Missing required fields: ${fieldValidation.missing.join(", ")}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      message: errors.length === 0 ? "Response validation passed" : "Response validation failed",
      details: { errors },
    };
  }
}
