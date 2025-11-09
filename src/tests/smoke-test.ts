/**
 * Smoke Test Suite
 *
 * Purpose: Quick validation to ensure the system is functional and accessible
 * Duration: 30 seconds with 10 concurrent virtual users
 *
 * This test performs basic health checks on the API endpoints to verify:
 * - System availability
 * - Basic endpoint functionality
 * - Acceptable response times under minimal load
 *
 * Success Criteria:
 * - All requests should return status 200
 * - 95% of requests complete within 500ms
 * - 99% of requests complete within 1000ms
 * - Less than 1% request failure rate
 *
 * @module smoke-test
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";
import { config, scenarios } from "../utils/config";
import { RequestBuilder } from "../helpers/request-builder";
import { ResponseValidator } from "../helpers/response-validator";
import { Logger } from "../utils/logger";

// Initialize logger for this test
const logger = new Logger("SmokeTest");

// Test configuration
export const options: Options = {
  scenarios: {
    smoke: scenarios.smoke,
  },
  thresholds: config.thresholds,
};

// Initialize request builder
const requestBuilder = new RequestBuilder(config.baseUri);

/**
 * Test setup function - runs once per VU at the start
 */
export function setup() {
  logger.info("Starting smoke test execution");
  logger.info("Test Configuration", {
    baseUri: config.baseUri,
    duration: scenarios.smoke.duration,
    vus: scenarios.smoke.vus,
  });
  return { startTime: Date.now() };
}

/**
 * Main test function - executed repeatedly by each VU
 */
export default function () {
  // Test 1: GET /users endpoint
  logger.step("Testing GET /users endpoint");

  const usersUrl = requestBuilder.buildUrl("/users");
  const usersResponse = http.get(usersUrl);

  check(usersResponse, {
    "GET /users: status is 200": (r) => r.status === 200,
    "GET /users: response time < 200ms": (r) => r.timings.duration < 200,
    "GET /users: status is successful": (r) => ResponseValidator.isSuccessful(r.status),
    "GET /users: has response body": (r) => ResponseValidator.hasResponseBody(r.body),
  });

  logger.logRequest("GET", usersUrl, usersResponse.status, usersResponse.timings.duration);

  // Think time between requests (simulate user behavior)
  sleep(1);

  // Test 2: GET /posts endpoint
  logger.step("Testing GET /posts endpoint");

  const postsUrl = requestBuilder.buildUrl("/posts");
  const postsResponse = http.get(postsUrl);

  check(postsResponse, {
    "GET /posts: status is 200": (r) => r.status === 200,
    "GET /posts: response time < 200ms": (r) => r.timings.duration < 200,
    "GET /posts: has response body": (r) => ResponseValidator.hasResponseBody(r.body),
  });

  logger.logRequest("GET", postsUrl, postsResponse.status, postsResponse.timings.duration);

  // Think time between iterations
  sleep(1);
}

/**
 * Test teardown function - runs once at the end
 * @param data - Data passed from setup function
 */
export function teardown(data: any) {
  const duration = (Date.now() - data.startTime) / 1000;
  logger.info("Smoke test completed", {
    totalDuration: `${duration.toFixed(2)}s`,
  });
}

/**
 * Custom summary handler - defines output format and location
 * @param data - Test execution summary data
 * @returns Object defining where to save summary results
 */
export function handleSummary(data: any) {
  logger.info("Generating test summary");

  return {
    "results/smoke-summary.json": JSON.stringify(data, null, 2),
    stdout: JSON.stringify(data, null, 2),
  };
}
