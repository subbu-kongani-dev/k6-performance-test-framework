/**
 * Stress Test Suite
 *
 * Purpose: Identify system breaking points and stability under extreme load
 * Pattern: Progressive load increase 0 → 50 → 100 → 0
 * Duration: 16 minutes total with gradual ramp-up and sustained high load
 *
 * This test pushes the system beyond normal operating conditions to:
 * - Identify maximum capacity
 * - Detect resource exhaustion
 * - Observe degradation patterns
 * - Validate error handling under stress
 *
 * Success Criteria (relaxed for stress conditions):
 * - 95% of requests complete within 1000ms
 * - 99% of requests complete within 2000ms
 * - Less than 5% request failure rate
 * - System recovery after load reduction
 *
 * @module stress-test
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";
import { config, scenarios } from "../utils/config";
import { RequestBuilder } from "../helpers/request-builder";
import { ResponseValidator } from "../helpers/response-validator";
import { Logger } from "../utils/logger";
import { customMetrics } from "../utils/metrics";

// Initialize logger for this test
const logger = new Logger("StressTest");

// Test configuration with relaxed thresholds for stress testing
export const options: Options = {
  scenarios: {
    stress: scenarios.stress,
  },
  thresholds: {
    http_req_duration: ["p(95)<1000", "p(99)<2000"],
    http_req_failed: ["rate<0.05"], // Allow up to 5% failure under stress
  },
};

// Initialize request builder
const requestBuilder = new RequestBuilder(config.baseUri);

/**
 * Test setup function - runs once before test execution
 */
export function setup() {
  logger.info("Starting stress test execution");
  logger.info("Test Configuration", {
    baseUri: config.baseUri,
    stages: scenarios.stress.stages,
    note: "Testing system under extreme load conditions",
  });
  return { startTime: Date.now(), errorCount: 0 };
}

/**
 * Main test function - high-frequency requests to stress the system
 */
export default function () {
  logger.step("Executing stress test iteration");

  // Test endpoint under stress
  const url = requestBuilder.buildUrl("/posts");
  const response = http.get(url);

  // Validate response
  const checks = check(response, {
    "Stress Test: status is 200": (r) => r.status === 200,
    "Stress Test: status is successful": (r) => ResponseValidator.isSuccessful(r.status),
    "Stress Test: response time < 2000ms": (r) =>
      ResponseValidator.meetsPerformanceThresholds(r.timings.duration, 2000),
    "Stress Test: has response body": (r) => ResponseValidator.hasResponseBody(r.body),
  });

  // Track metrics
  customMetrics.durationInSeconds.add(response.timings.duration / 1000);

  // Log errors for analysis
  if (!checks) {
    customMetrics.errorRate.add(1);
    logger.error("Stress test request failed", {
      status: response.status,
      duration: response.timings.duration,
      stage: "stress",
    });
  }

  // Reduced think time to increase pressure
  sleep(0.5);

  // Additional concurrent request to increase load
  const postsListUrl = requestBuilder.buildUrl("/posts", { _limit: "10" });
  const postsResponse = http.get(postsListUrl);

  check(postsResponse, {
    "Stress Test (list): status is 200": (r) => r.status === 200,
    "Stress Test (list): response time < 2000ms": (r) => r.timings.duration < 2000,
  });

  if (postsResponse.status !== 200) {
    customMetrics.errorRate.add(1);
  }

  logger.logRequest("GET", url, response.status, response.timings.duration);
}

/**
 * Test teardown function - runs once after test completion
 * @param data - Data passed from setup function
 */
export function teardown(data: any) {
  const duration = (Date.now() - data.startTime) / 1000;
  logger.info("Stress test completed", {
    totalDuration: `${duration.toFixed(2)}s`,
    note: "Review error rates and response times during peak load",
  });
}

/**
 * Custom summary handler - defines output format and location
 * @param data - Test execution summary data
 * @returns Object defining where to save summary results
 */
export function handleSummary(data: any) {
  logger.info("Generating stress test summary");

  // Calculate additional stress test metrics
  const metrics = data.metrics;
  const failureRate = metrics.http_req_failed?.values?.rate || 0;
  const p95Duration = metrics.http_req_duration?.values?.["p(95)"] || 0;

  logger.info("Stress Test Results", {
    failureRate: `${(failureRate * 100).toFixed(2)}%`,
    p95ResponseTime: `${p95Duration.toFixed(2)}ms`,
  });

  return {
    "results/stress-summary.json": JSON.stringify(data, null, 2),
    stdout: JSON.stringify(data, null, 2),
  };
}
