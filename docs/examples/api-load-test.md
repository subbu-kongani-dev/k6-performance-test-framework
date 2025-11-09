# Example: API Load Test

This example demonstrates how to create a comprehensive load test for a REST API using the framework's utilities.

## Scenario

Testing an e-commerce API with the following user workflow:

1. Browse products
2. View product details
3. Add item to cart
4. View cart
5. Checkout

## Test Implementation

```typescript
import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";
import { RequestBuilder } from "../helpers/request-builder";
import { ResponseValidator } from "../helpers/response-validator";
import { Logger } from "../utils/logger";
import { generateUser, randomElement } from "../fixtures/data-generator";
import { customMetrics } from "../utils/metrics";

const logger = new Logger("EcommerceLoadTest");
const requestBuilder = new RequestBuilder("https://api.example.com");

export const options: Options = {
  scenarios: {
    ecommerce_workflow: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 20 }, // Ramp-up
        { duration: "10m", target: 50 }, // Sustained load
        { duration: "2m", target: 0 }, // Ramp-down
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<800", "p(99)<1500"],
    http_req_failed: ["rate<0.02"],
    "http_req_duration{name:browse_products}": ["p(95)<400"],
    "http_req_duration{name:add_to_cart}": ["p(95)<600"],
    "http_req_duration{name:checkout}": ["p(95)<1000"],
  },
};

// Test data
const categories = ["electronics", "books", "clothing", "home"];
let authToken: string;

export function setup() {
  logger.info("Setting up test data");

  // Login to get auth token
  const loginPayload = requestBuilder.buildPayload({
    username: "testuser",
    password: "testpass123",
  });

  const loginResponse = http.post(requestBuilder.buildUrl("/auth/login"), loginPayload, {
    headers: requestBuilder.getHeaders(),
  });

  if (ResponseValidator.isSuccessful(loginResponse.status)) {
    const body = ResponseValidator.parseJsonSafely(
      typeof loginResponse.body === "string" ? loginResponse.body : ""
    );
    authToken = body?.token;
    logger.info("Authentication successful");
  }

  return { token: authToken };
}

export default function (data: any) {
  // Set auth token for this VU
  const authedBuilder = requestBuilder.clone().setBearerToken(data.token);

  // Step 1: Browse Products
  logger.step("Browsing products");
  const category = randomElement(categories);
  const productsUrl = authedBuilder.buildUrl("/products", {
    category,
    page: "1",
    limit: "20",
  });

  const productsResponse = http.get(productsUrl, {
    tags: { name: "browse_products" },
  });

  const browseCheck = check(productsResponse, {
    "Browse: status is 200": (r) => r.status === 200,
    "Browse: response time OK": (r) =>
      ResponseValidator.meetsPerformanceThresholds(r.timings.duration, 400),
    "Browse: has products": (r) => {
      const body = ResponseValidator.parseJsonSafely(typeof r.body === "string" ? r.body : "");
      return body && Array.isArray(body.products) && body.products.length > 0;
    },
  });

  if (!browseCheck) {
    customMetrics.errorRate.add(1);
    return; // Exit early on failure
  }

  customMetrics.durationInSeconds.add(productsResponse.timings.duration / 1000);
  sleep(2); // User thinks about products

  // Step 2: View Product Details
  logger.step("Viewing product details");
  const productsBody = ResponseValidator.parseJsonSafely(
    typeof productsResponse.body === "string" ? productsResponse.body : ""
  );

  if (productsBody?.products?.length > 0) {
    const productId = randomElement(productsBody.products).id;
    const productUrl = authedBuilder.buildUrl(`/products/${productId}`);

    const productResponse = http.get(productUrl, {
      tags: { name: "view_product" },
    });

    check(productResponse, {
      "Product: status is 200": (r) => r.status === 200,
      "Product: has required fields": (r) => {
        const body = ResponseValidator.parseJsonSafely(typeof r.body === "string" ? r.body : "");
        const validation = ResponseValidator.hasRequiredFields(body, [
          "id",
          "name",
          "price",
          "stock",
        ]);
        return validation.valid;
      },
    });

    sleep(3); // User reads product details

    // Step 3: Add to Cart
    logger.step("Adding product to cart");
    const addToCartPayload = authedBuilder.buildPayload({
      productId,
      quantity: 1,
    });

    const addToCartResponse = http.post(authedBuilder.buildUrl("/cart/items"), addToCartPayload, {
      headers: authedBuilder.getHeaders(),
      tags: { name: "add_to_cart" },
    });

    check(addToCartResponse, {
      "Add to Cart: status is 201": (r) => r.status === 201,
      "Add to Cart: response time OK": (r) =>
        ResponseValidator.meetsPerformanceThresholds(r.timings.duration, 600),
    });

    sleep(1);

    // Step 4: View Cart
    logger.step("Viewing cart");
    const cartResponse = http.get(authedBuilder.buildUrl("/cart"), {
      tags: { name: "view_cart" },
    });

    check(cartResponse, {
      "Cart: status is 200": (r) => r.status === 200,
      "Cart: has items": (r) => {
        const body = ResponseValidator.parseJsonSafely(typeof r.body === "string" ? r.body : "");
        return body && body.items && body.items.length > 0;
      },
    });

    sleep(2); // User reviews cart

    // Step 5: Checkout (only 30% of users complete checkout)
    if (Math.random() < 0.3) {
      logger.step("Processing checkout");
      const checkoutPayload = authedBuilder.buildPayload({
        paymentMethod: "credit_card",
        shippingAddress: {
          street: "123 Test St",
          city: "Test City",
          zip: "12345",
        },
      });

      const checkoutResponse = http.post(
        authedBuilder.buildUrl("/orders/checkout"),
        checkoutPayload,
        {
          headers: authedBuilder.getHeaders(),
          tags: { name: "checkout" },
        }
      );

      check(checkoutResponse, {
        "Checkout: status is 201": (r) => r.status === 201,
        "Checkout: response time OK": (r) =>
          ResponseValidator.meetsPerformanceThresholds(r.timings.duration, 1000),
        "Checkout: order created": (r) => {
          const body = ResponseValidator.parseJsonSafely(typeof r.body === "string" ? r.body : "");
          return body && body.orderId;
        },
      });

      if (checkoutResponse.status !== 201) {
        customMetrics.errorRate.add(1);
        logger.error("Checkout failed", {
          status: checkoutResponse.status,
        });
      }
    }
  }

  sleep(1); // Wait before next iteration
}

export function teardown(data: any) {
  logger.info("Test completed");
}

export function handleSummary(data: any) {
  const metrics = data.metrics;

  logger.info("Test Summary", {
    totalRequests: metrics.http_reqs?.values?.count || 0,
    failedRequests: metrics.http_req_failed?.values?.rate || 0,
    avgDuration: metrics.http_req_duration?.values?.avg || 0,
    p95Duration: metrics.http_req_duration?.values?.["p(95)"] || 0,
  });

  return {
    "results/ecommerce-load-summary.json": JSON.stringify(data, null, 2),
    stdout: JSON.stringify(data, null, 2),
  };
}
```

## Running the Test

```bash
# Build the test
npm run build

# Run the test
k6 run dist/ecommerce-load-test.js

# Run with custom environment
ENVIRONMENT=production k6 run dist/ecommerce-load-test.js

# Run with k6 Cloud
k6 cloud dist/ecommerce-load-test.js
```

## Expected Results

```
     ✓ Browse: status is 200
     ✓ Browse: response time OK
     ✓ Browse: has products
     ✓ Product: status is 200
     ✓ Product: has required fields
     ✓ Add to Cart: status is 201
     ✓ Add to Cart: response time OK
     ✓ Cart: status is 200
     ✓ Cart: has items
     ✓ Checkout: status is 201
     ✓ Checkout: response time OK
     ✓ Checkout: order created

     checks.........................: 98.50% ✓ 11820 ✗ 180
     data_received..................: 85 MB  120 kB/s
     data_sent......................: 12 MB  17 kB/s
     http_req_blocked...............: avg=1.2ms   min=1µs   med=4µs    max=250ms
     http_req_duration..............: avg=285ms   min=45ms  med=245ms  max=2.1s   p(95)=650ms
     http_reqs......................: 12000  170/s
     iteration_duration.............: avg=12.5s   min=8s    med=11.2s  max=18s
     vus............................: 50     min=0  max=50
```

## Analysis

- **Success Rate**: 98.5% (within acceptable threshold)
- **Response Time**: p95 = 650ms (meets 800ms threshold)
- **Throughput**: 170 requests/second
- **Issues**: Some timeout errors during peak load (180 failures)

## Recommendations

1. Investigate timeout errors at peak load
2. Optimize checkout endpoint (slowest operation)
3. Consider caching for product browsing
4. Monitor database query performance
