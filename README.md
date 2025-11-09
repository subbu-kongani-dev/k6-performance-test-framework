# 🚀 K6 Performance Test Framework

[![CI/CD Status](https://github.com/yourusername/k6-performance-test-framework/workflows/K6%20Performance%20Testing%20CI/CD/badge.svg)](https://github.com/yourusername/k6-performance-test-framework/actions)
[![codecov](https://codecov.io/gh/yourusername/k6-performance-test-framework/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/k6-performance-test-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, production-ready performance testing framework built with [k6](https://k6.io/), TypeScript, and Jest. This framework provides a structured approach to performance testing with built-in best practices, reusable utilities, and comprehensive CI/CD integration.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Test Types](#-test-types)
- [Configuration](#-configuration)
- [Environment Management](#-environment-management)
- [CI/CD Integration](#-cicd-integration)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🎯 **TypeScript Support** - Full TypeScript integration with type safety
- 🧪 **Multiple Test Types** - Smoke, Load, and Stress testing scenarios
- 📊 **Custom Metrics** - Built-in custom metrics and reporting
- 🔧 **Modular Architecture** - Reusable helpers, utilities, and fixtures
- 🌍 **Multi-Environment** - Support for dev, staging, and production environments
- 📝 **Comprehensive Logging** - Structured logging with different log levels
- ✅ **Unit Testing** - Jest-based unit tests for utilities and helpers
- 🤖 **CI/CD Ready** - GitHub Actions workflow with automated testing
- 📈 **Data Generators** - Built-in test data generators for realistic scenarios
- 🎨 **Code Quality** - Prettier and TypeScript linting configured
- 🔄 **Request Builder** - Fluent API for building HTTP requests
- ✔️ **Response Validator** - Comprehensive response validation utilities

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    K6 Test Framework                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Test Suite  │  │   Helpers    │  │  Utilities   │       │
│  │             │  │              │  │              │       │
│  │ - Smoke     │  │ - Request    │  │ - Logger     │       │
│  │ - Load      │──│   Builder    │──│ - Config     │       │
│  │ - Stress    │  │ - Response   │  │ - Metrics    │       │
│  │             │  │   Validator  │  │ - Validator  │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Fixtures   │  │  Constants   │  │    Config    │       │
│  │             │  │              │  │              │       │
│  │ - Test Data │  │ - HTTP Codes │  │ - Env Setup  │       │
│  │ - Schemas   │  │ - Messages   │  │ - Scenarios  │       │
│  │ - Payloads  │  │ - Enums      │  │ - Thresholds │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 16.x (recommended: 18.x or higher)
- **npm** >= 8.x or **yarn** >= 1.22.x
- **k6** >= 0.45.0 ([Installation Guide](https://k6.io/docs/get-started/installation/))

### Installing k6

**macOS (Homebrew)**

```bash
brew install k6
```

**Windows (Chocolatey)**

```bash
choco install k6
```

**Linux**

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Docker**

```bash
docker pull grafana/k6
```

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/k6-performance-test-framework.git
   cd k6-performance-test-framework
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run lint          # TypeScript type checking
   npm run test:unit     # Run unit tests
   k6 version            # Verify k6 installation
   ```

## 🎯 Quick Start

### Run Your First Test

1. **Build the test bundles**

   ```bash
   npm run build
   ```

2. **Run a smoke test**

   ```bash
   npm run test:smoke
   ```

3. **View the results**
   Results are saved in the `results/` directory as JSON files.

### Example Output

```
     ✓ GET /users: status is 200
     ✓ GET /users: response time < 200ms
     ✓ GET /posts: status is 200

     checks.........................: 100.00% ✓ 30       ✗ 0
     data_received..................: 45 kB   1.5 kB/s
     data_sent......................: 3.5 kB  117 B/s
     http_req_duration..............: avg=125ms min=98ms med=120ms max=180ms p(95)=165ms p(99)=175ms
```

## 📁 Project Structure

```
k6-performance-test-framework/
├── .github/
│   └── workflows/
│       └── k6-performance-tests.yml    # CI/CD pipeline
├── src/
│   ├── config/
│   │   └── environment.ts              # Environment configuration
│   ├── constants/
│   │   └── index.ts                    # Constants and enums
│   ├── fixtures/
│   │   ├── data-generator.ts           # Test data generators
│   │   ├── test-data.ts                # Static test data
│   │   └── __tests__/
│   ├── helpers/
│   │   ├── request-builder.ts          # HTTP request builder
│   │   ├── response-validator.ts       # Response validation
│   │   └── __tests__/
│   ├── tests/
│   │   ├── smoke-test.ts               # Smoke test suite
│   │   ├── load-test.ts                # Load test suite
│   │   └── stress-test.ts              # Stress test suite
│   └── utils/
│       ├── config.ts                   # Test configuration
│       ├── logger.ts                   # Logging utility
│       ├── metrics.ts                  # Custom metrics
│       ├── validator.ts                # Validation utilities
│       └── __tests__/
├── dist/                               # Compiled test bundles (generated)
├── results/                            # Test results (generated)
├── coverage/                           # Coverage reports (generated)
├── package.json
├── tsconfig.json
├── webpack.config.js
├── .prettierrc.json
└── README.md
```

## 📖 Usage

### Building Tests

Compile TypeScript tests to JavaScript bundles that k6 can execute:

```bash
npm run build
```

### Running Tests

**All Test Types**

```bash
# Run all tests sequentially
npm run test:all

# Run performance tests only (smoke, load, stress)
npm run test:performance
```

**Individual Test Types**

```bash
# Smoke test (30s, 10 VUs)
npm run test:smoke

# Load test (9m, ramping 0→20→50→0)
npm run test:load

# Stress test (16m, ramping 0→50→100→0)
npm run test:stress
```

**Unit Tests**

```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:unit:coverage
```

### Code Quality

```bash
# Type checking
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🧪 Test Types

### 1. Smoke Test

**Purpose**: Quick validation that the system is functional

- **Duration**: 30 seconds
- **Virtual Users**: 10 constant VUs
- **Success Criteria**:
  - All requests return 2xx status codes
  - Response times < 200ms
  - 0% error rate

**Use Case**: Run before deployments, after code changes, or in CI/CD pipelines

```bash
npm run test:smoke
```

### 2. Load Test

**Purpose**: Evaluate performance under expected load

- **Duration**: 9 minutes
- **Pattern**: Ramping VUs (0 → 20 → 50 → 0)
- **Stages**:
  - Ramp-up: 2 minutes to 20 VUs
  - Peak: 5 minutes at 50 VUs
  - Ramp-down: 2 minutes to 0 VUs
- **Success Criteria**:
  - 95% of requests < 500ms
  - 99% of requests < 1000ms
  - <1% error rate

**Use Case**: Regular performance validation, capacity planning

```bash
npm run test:load
```

### 3. Stress Test

**Purpose**: Identify system breaking points

- **Duration**: 16 minutes
- **Pattern**: Progressive load (0 → 50 → 100 → 0)
- **Success Criteria** (relaxed):
  - 95% of requests < 1000ms
  - 99% of requests < 2000ms
  - <5% error rate

**Use Case**: Capacity planning, identifying bottlenecks

```bash
npm run test:stress
```

## ⚙️ Configuration

### Test Configuration

Edit `src/utils/config.ts`:

```typescript
export const config = {
  baseUri: "https://jsonplaceholder.typicode.com",
  thresholds: {
    http_req_duration: ["p(95) < 500", "p(99) < 1000"],
    http_req_failed: ["rate < 0.01"],
  },
};
```

### Scenarios

Modify test scenarios in `src/utils/config.ts`:

```typescript
export const scenarios = {
  smoke: {
    executor: "constant-vus",
    vus: 10,
    duration: "30s",
  },
  load: {
    executor: "ramping-vus",
    startVus: 0,
    stages: [
      { duration: "2m", target: 20 },
      { duration: "5m", target: 50 },
      { duration: "2m", target: 0 },
    ],
  },
};
```

### Custom Metrics

Add custom metrics in `src/utils/metrics.ts`:

```typescript
import { Trend, Rate, Counter } from "k6/metrics";

export const customMetrics = {
  durationInSeconds: new Trend("duration_in_seconds"),
  requestsPerSecond: new Rate("requests_per_second"),
  errorRate: new Rate("error_count"),
};
```

## 🌍 Environment Management

The framework supports multiple environments with different configurations.

### Environment Configuration

Create environment-specific configs in `src/config/environment.ts`:

```typescript
export enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}
```

### Using Environments

**Via Environment Variable**

```bash
ENVIRONMENT=production npm run test:smoke
```

**Via k6 CLI**

```bash
k6 run -e ENVIRONMENT=staging dist/smoke-test.js
```

### Environment Variables

Create a `.env` file (not committed to git):

```env
ENVIRONMENT=staging
BASE_URL=https://staging-api.example.com
LOG_LEVEL=INFO
K6_CLOUD_TOKEN=your_token_here
```

## 🤖 CI/CD Integration

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow that:

- ✅ Runs code quality checks and unit tests
- 🏗 Builds test bundles
- 🧪 Executes smoke tests on every PR/push
- 📊 Runs load/stress tests on main branch and schedule
- 📈 Generates performance reports
- 💬 Comments results on PRs
- ☁️ Optional k6 Cloud integration

### Required Secrets

Configure these in your GitHub repository settings:

```
BASE_URL              # Base URL for API tests (optional)
K6_CLOUD_TOKEN        # k6 Cloud token for cloud execution (optional)
SLACK_WEBHOOK_URL     # Slack webhook for notifications (optional)
```

### Workflow Triggers

- **Push/PR**: Runs code quality and smoke tests
- **Main branch**: Runs full test suite
- **Schedule**: Daily at 2 AM UTC
- **Manual**: Via workflow_dispatch with custom options

### Manual Workflow Dispatch

Run specific tests manually:

```bash
# Via GitHub UI: Actions → K6 Performance Testing CI/CD → Run workflow
# Or via GitHub CLI:
gh workflow run k6-performance-tests.yml \
  -f test_type=load \
  -f environment=production
```

## 📝 Best Practices

### 1. Test Design

✅ **DO**:

- Start with smoke tests before load tests
- Use realistic user scenarios
- Include think time between requests
- Validate response structure and content
- Use custom metrics for business KPIs

❌ **DON'T**:

- Run stress tests in production
- Skip smoke tests before major releases
- Use hardcoded credentials
- Ignore failed assertions

### 2. Request Building

```typescript
import { RequestBuilder } from "./helpers/request-builder";

const builder = new RequestBuilder(baseUrl);

// Good: Fluent API with method chaining
const url = builder
  .setHeader("Authorization", `Bearer ${token}`)
  .setHeader("X-API-Version", "v2")
  .buildUrl("/users", { page: "1", limit: "10" });

// Good: Reusable request configurations
const authBuilder = builder.clone().setBearerToken(token);
```

### 3. Response Validation

```typescript
import { ResponseValidator } from "./helpers/response-validator";

// Comprehensive validation
const validation = ResponseValidator.validateResponse(
  response.status,
  response.body,
  ["id", "name", "email"], // required fields
  500 // max duration in ms
);

if (!validation.valid) {
  logger.error("Validation failed", validation.details);
}
```

### 4. Logging

```typescript
import { Logger } from "./utils/logger";

const logger = new Logger("MyTest");

logger.info("Starting test execution");
logger.step("User login", { username: "testuser" });
logger.logRequest("GET", url, response.status, response.timings.duration);
logger.error("Test failed", { error: errorMessage });
```

### 5. Data Generation

```typescript
import { generateUser, generateArray } from "./fixtures/data-generator";

// Generate single user
const user = generateUser();

// Generate multiple users
const users = generateArray(generateUser, 10);
```

## 🔍 Troubleshooting

### Common Issues

**Issue**: `k6: command not found`

```bash
# Solution: Install k6 (see Prerequisites section)
brew install k6  # macOS
```

**Issue**: TypeScript compilation errors

```bash
# Solution: Clean and rebuild
npm run clean
npm install
npm run build
```

**Issue**: Tests failing with network errors

```bash
# Solution: Check base URL and network connectivity
ping api.example.com
curl -I https://api.example.com
```

**Issue**: High error rates in tests

```bash
# Solution:
# 1. Check server capacity
# 2. Review thresholds in config
# 3. Reduce VUs or ramp-up speed
# 4. Check for rate limiting
```

## 📊 Interpreting Results

### Key Metrics

- **http_req_duration**: Response time (p95, p99 are critical)
- **http_req_failed**: Request failure rate
- **http_reqs**: Requests per second (throughput)
- **vus**: Active virtual users
- **checks**: Assertion pass rate

### Success Criteria

✅ **Passing Test**:

```
checks.........................: 100.00% ✓ 1500 ✗ 0
http_req_duration..............: avg=125ms p(95)=250ms p(99)=450ms
http_req_failed................: 0.00%
```

❌ **Failing Test**:

```
checks.........................: 85.00% ✓ 1275 ✗ 225
http_req_duration..............: avg=2500ms p(95)=5000ms p(99)=8000ms
http_req_failed................: 15.00%
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test:unit && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [k6](https://k6.io/) - Modern load testing tool
- [Grafana](https://grafana.com/) - k6 Cloud platform
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Jest](https://jestjs.io/) - Testing framework

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/k6-performance-test-framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/k6-performance-test-framework/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/k6-performance-test-framework/wiki)

---

**Made with ❤️ by the Performance Engineering Team**

⭐ If you find this framework helpful, please star the repository!
