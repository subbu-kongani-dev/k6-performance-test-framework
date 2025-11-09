import { Trend, Rate, Counter } from "k6/metrics";

/**
 * Custom metrics for k6 performance tests.
 * Includes trends, rates, and counters to monitor various aspects of the tests.
 * @module metrics
 */
export const customMetrics = {
  durationInSeconds: new Trend("duration_in_seconds"), // Trend to track duration of requests in seconds
  requestsPerSecond: new Rate("requests_per_second"), // Rate to track requests per second
  errorRate: new Rate("error_count"), // Rate to track error count
  dataSent: new Counter("data_sent_bytes"), // Counter to track data sent in bytes
  dataReceived: new Counter("data_received_bytes"), // Counter to track data received in bytes
};
