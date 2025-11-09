/**
 * Load Test Suite
 *
 * Purpose: Evaluate system performance under expected production load
 * Pattern: Ramping VUs from 0 → 20 → 50 → 0
 * Duration: 9 minutes total (2m ramp-up, 5m sustained, 2m ramp-down)
 *
 * This test simulates realistic user behavior patterns including:
 * - Reading data (GET requests)
 * - Creating new resources (POST requests)
 * - Variable think times between actions
 *
 * Success Criteria:
 * - 95% of requests complete within 500ms
 * - 99% of requests complete within 1000ms
 * - Less than 1% request failure rate
 * - System stability under sustained load
 *
 * @module load-test
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";
import { config, scenarios } from "../utils/config";
import { customMetrics } from "../utils/metrics";
import { RequestBuilder } from "../helpers/request-builder";
import { ResponseValidator } from "../helpers/response-validator";
import { Logger } from "../utils/logger";
import { generatePost } from "../fixtures/data-generator";

// Initialize logger for this test
const logger = new Logger("LoadTest");

// Test configuration
export const options: Options = {
  scenarios: {
    load: scenarios.load,
  },
  thresholds: config.thresholds,
};

// Initialize request builder
const requestBuilder = new RequestBuilder(config.baseUri);

/**
 * Test setup function - runs once before test execution
 */
export function setup() {
  logger.info("Starting load test execution");
  logger.info("Test Configuration", {
    baseUri: config.baseUri,
    stages: scenarios.load.stages,
  });
  return { startTime: Date.now() };
}

/**
 * Main test function - simulates user workflow
 */
export default function () {
  // Scenario 1: Retrieve list of posts (common read operation)
  logger.step("Retrieving posts list");

  const getUrl = requestBuilder.buildUrl("/posts", {});
  const getResponse = http.get(getUrl);

  const getChecks = check(getResponse, {
    "GET /posts: status is 200": (r) => r.status === 200,
    "GET /posts: status is successful": (r) => ResponseValidator.isSuccessful(r.status),
    "GET /posts: response time < 500ms": (r) =>
      ResponseValidator.meetsPerformanceThresholds(r.timings.duration, 500),
    "GET /posts: has response body": (r) => ResponseValidator.hasResponseBody(r.body),
  });

  // Track custom metrics
  customMetrics.durationInSeconds.add(getResponse.timings.duration / 1000);

  if (!getChecks) {
    customMetrics.errorRate.add(1);
    logger.error("GET request failed", {
      status: getResponse.status,
      duration: getResponse.timings.duration,
    });
  }

  logger.logRequest("GET", getUrl, getResponse.status, getResponse.timings.duration);

  // Track data metrics
  const responseBodyLength =
    typeof getResponse.body === "string"
      ? getResponse.body.length
      : getResponse.body
        ? getResponse.body.byteLength
        : 0;
  customMetrics.dataReceived.add(responseBodyLength);

  // Simulate user think time
  sleep(1);

  // Scenario 2: Create a new post (write operation)
  logger.step("Creating new post");

  const postUrl = requestBuilder.buildUrl("/posts", {});
  const postData = generatePost();
  const payload = requestBuilder.buildPayload({
    title: postData.title,
    body: postData.body,
    userId: postData.userId,
  });

  const postResponse = http.post(postUrl, payload, {
    headers: requestBuilder.getRequestHeaders(),
  });

  const postChecks = check(postResponse, {
    "POST /posts: status is 201": (r) => r.status === 201,
    "POST /posts: response time < 1000ms": (r) =>
      ResponseValidator.meetsPerformanceThresholds(r.timings.duration, 1000),
    "POST /posts: has response body": (r) => ResponseValidator.hasResponseBody(r.body),
  });

  // Track metrics
  customMetrics.durationInSeconds.add(postResponse.timings.duration / 1000);
  customMetrics.dataSent.add(payload.length);

  const postResponseBodyLength =
    typeof postResponse.body === "string"
      ? postResponse.body.length
      : postResponse.body
        ? postResponse.body.byteLength
        : 0;
  customMetrics.dataReceived.add(postResponseBodyLength);

  if (postResponse.status !== 201) {
    customMetrics.errorRate.add(1);
    logger.error("POST request failed", {
      status: postResponse.status,
      duration: postResponse.timings.duration,
      payload: postData.title,
    });
  }

  logger.logRequest("POST", postUrl, postResponse.status, postResponse.timings.duration);

  // Scenario 3: Retrieve specific post (read by ID)
  if (postChecks && postResponse.body) {
    logger.step("Retrieving created post");

    const bodyString = typeof postResponse.body === "string" ? postResponse.body : "";
    const responseBody = ResponseValidator.parseJsonSafely(bodyString);
    if (responseBody && responseBody.id) {
      const specificPostUrl = requestBuilder.buildUrl(`/posts/${responseBody.id}`);
      const specificPostResponse = http.get(specificPostUrl);

      check(specificPostResponse, {
        "GET /posts/:id: status is 200": (r) => r.status === 200,
        "GET /posts/:id: matches created post": (r) => {
          const specificBodyString = typeof r.body === "string" ? r.body : "";
          const body = ResponseValidator.parseJsonSafely(specificBodyString);
          return body && body.id === responseBody.id;
        },
      });

      logger.logRequest(
        "GET",
        specificPostUrl,
        specificPostResponse.status,
        specificPostResponse.timings.duration
      );
    }
  }

  // Simulate user think time before next iteration
  sleep(1);
}

/**
 * Test teardown function - runs once after test completion
 * @param data - Data passed from setup function
 */
export function teardown(data: any) {
  const duration = (Date.now() - data.startTime) / 1000;
  logger.info("Load test completed", {
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
    "results/load-summary.json": JSON.stringify(data, null, 2),
    stdout: JSON.stringify(data, null, 2),
  };
}
