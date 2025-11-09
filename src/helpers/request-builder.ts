import { ContentType, ERROR_MESSAGES } from "../constants";
import { Logger } from "../utils/logger";

/**
 * Helper class to build HTTP requests for performance testing.
 * Provides a fluent interface for constructing HTTP requests with headers, query parameters, and payloads.
 *
 * @module request-builder
 * @example
 * ```typescript
 * const builder = new RequestBuilder('https://api.example.com');
 * const url = builder
 *   .setHeader('Authorization', 'Bearer token')
 *   .buildUrl('/users', { limit: '10' });
 * ```
 */
export class RequestBuilder {
  private baseUrl: string;
  private headers: Record<string, string>;
  private logger: Logger;

  /**
   * Creates a new RequestBuilder instance
   * @param baseUrl - The base URL for all requests (e.g., 'https://api.example.com')
   * @throws {Error} If the base URL is invalid
   */
  constructor(baseUrl: string) {
    this.validateUrl(baseUrl);
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.headers = {
      "Content-Type": ContentType.JSON,
      Accept: ContentType.JSON,
    };
    this.logger = new Logger("RequestBuilder");
  }

  /**
   * Validates if a URL is properly formatted
   * @param url - The URL to validate
   * @throws {Error} If the URL is invalid
   */
  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.INVALID_URL, { url });
      throw new Error(`${ERROR_MESSAGES.INVALID_URL}: ${url}`);
    }
  }

  /**
   * Sets a custom header for the request
   * @param key - The header name (e.g., 'Authorization', 'X-API-Key')
   * @param value - The header value
   * @returns The RequestBuilder instance for method chaining
   * @throws {Error} If key or value is empty
   */
  setHeader(key: string, value: string): RequestBuilder {
    if (!key || key.trim() === "") {
      throw new Error("Header key cannot be empty");
    }
    if (value === null || value === undefined) {
      throw new Error(`Header value for '${key}' cannot be null or undefined`);
    }
    this.headers[key] = value;
    this.logger.debug(`Header set: ${key}`);
    return this;
  }

  /**
   * Sets multiple headers at once
   * @param headers - Object containing header key-value pairs
   * @returns The RequestBuilder instance for method chaining
   */
  setHeaders(headers: Record<string, string>): RequestBuilder {
    Object.entries(headers).forEach(([key, value]) => {
      this.setHeader(key, value);
    });
    return this;
  }

  /**
   * Sets the Content-Type header
   * @param contentType - The content type (use ContentType enum for common types)
   * @returns The RequestBuilder instance for method chaining
   */
  setContentType(contentType: string): RequestBuilder {
    return this.setHeader("Content-Type", contentType);
  }

  /**
   * Sets an Authorization header with Bearer token
   * @param token - The bearer token
   * @returns The RequestBuilder instance for method chaining
   */
  setBearerToken(token: string): RequestBuilder {
    return this.setHeader("Authorization", `Bearer ${token}`);
  }

  /**
   * Sets an Authorization header with Basic authentication
   * @param username - The username
   * @param password - The password
   * @returns The RequestBuilder instance for method chaining
   */
  setBasicAuth(username: string, password: string): RequestBuilder {
    const encoded = btoa(`${username}:${password}`);
    return this.setHeader("Authorization", `Basic ${encoded}`);
  }

  /**
   * Builds a complete URL with query parameters
   * @param endpoint - The API endpoint path (e.g., '/users', '/posts/1')
   * @param queryParams - Optional query parameters as key-value pairs
   * @returns The complete URL with encoded query parameters
   * @example
   * ```typescript
   * buildUrl('/users', { page: '1', limit: '10' })
   * // Returns: 'https://api.example.com/users?page=1&limit=10'
   * ```
   */
  buildUrl(endpoint: string, queryParams?: Record<string, string>): string {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;

    // Check if queryParams is undefined, null, or empty object
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return url;
    }

    // Filter out null, undefined, and empty string values
    const validParams = Object.entries(queryParams).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    );

    if (validParams.length === 0) {
      return url;
    }

    const queryString = validParams
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    return `${url}?${queryString}`;
  }

  /**
   * Retrieves all headers set for the request
   * @returns A copy of the headers object to prevent external modification
   */
  getHeaders(): Record<string, string> {
    return { ...this.headers };
  }

  /**
   * Alias for getHeaders() for backwards compatibility
   * @returns A copy of the headers object
   */
  getRequestHeaders(): Record<string, string> {
    return this.getHeaders();
  }

  /**
   * Removes a specific header
   * @param key - The header name to remove
   * @returns The RequestBuilder instance for method chaining
   */
  removeHeader(key: string): RequestBuilder {
    delete this.headers[key];
    this.logger.debug(`Header removed: ${key}`);
    return this;
  }

  /**
   * Clears all custom headers (keeps default Content-Type and Accept)
   * @returns The RequestBuilder instance for method chaining
   */
  clearHeaders(): RequestBuilder {
    this.headers = {
      "Content-Type": ContentType.JSON,
      Accept: ContentType.JSON,
    };
    return this;
  }

  /**
   * Builds a JSON payload from the given data
   * @param data - The data object to serialize
   * @returns JSON string representation of the data
   * @throws {Error} If the data cannot be serialized to JSON
   */
  buildPayload(data: Record<string, any>): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      this.logger.error("Failed to build payload", { error });
      throw new Error(`Failed to serialize data to JSON: ${error}`);
    }
  }

  /**
   * Gets the base URL
   * @returns The base URL string
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Creates a new RequestBuilder with the same configuration
   * @returns A new RequestBuilder instance with copied configuration
   */
  clone(): RequestBuilder {
    const newBuilder = new RequestBuilder(this.baseUrl);
    newBuilder.headers = { ...this.headers };
    return newBuilder;
  }
}
