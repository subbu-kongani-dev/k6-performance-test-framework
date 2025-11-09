/**
 * Configuration settings for k6 performance tests.
 * Includes base URI, performance thresholds, and test scenarios.
 * @module config
 */
export const config = {
  baseUri: "https://jsonplaceholder.typicode.com",
  thresholds: {
    // Define performance thresholds
    //  Example: 95% of requests should complete within 500ms
    //  99% of requests should complete within 1000ms
    // Less than 1% of requests should fail
    http_req_duration: ["p(95) < 500", "p(99) < 1000"],
    http_req_failed: ["rate < 0.01"],
  },
};

/**
 * Test scenarios for k6 performance tests.
 * Each scenario defines the executor type, number of virtual users (VUs), and duration.
 * @module scenarios
 */
export const scenarios = {
  // "Step 1: Initialize",
  // Smoke Test Scenario
  // A quick test to ensure the system is up and running
  smoke: {
    executor: "constant-vus" as const,
    vus: 10,
    duration: "30s",
  },
  // "Step 2: Load Testing",
  // Load Test Scenario
  // Simulates a moderate load on the system to observe performance
  load: {
    executor: "ramping-vus" as const,
    startVus: 0,
    stages: [
      { duration: "2m", target: 20 },
      { duration: "5m", target: 50 },
      { duration: "2m", target: 0 },
    ],
  },
  // "Step 3: Stress Testing",
  // Stress Test Scenario
  // Pushes the system to its limits to identify breaking points
  // gradually increases the load to a high number of VUs
  stress: {
    executor: "ramping-vus" as const,
    startVus: 0,
    stages: [
      { duration: "2m", target: 50 },
      { duration: "5m", target: 50 },
      { duration: "2m", target: 100 },
      { duration: "5m", target: 100 },
      { duration: "2m", target: 0 },
    ],
  },
};
