# Architecture Overview

This document describes the architecture and design principles of the K6 Performance Test Framework.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Architecture Layers](#architecture-layers)
- [Component Details](#component-details)
- [Data Flow](#data-flow)
- [Extension Points](#extension-points)

## Design Philosophy

The framework is built on the following principles:

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Common functionality is abstracted into utilities
3. **Type Safety**: TypeScript provides compile-time type checking
4. **Testability**: All components are unit-testable
5. **Maintainability**: Clear structure and comprehensive documentation
6. **Extensibility**: Easy to add new tests and utilities

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│                  (Test Scripts & Reports)                    │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                           │
│              (Helpers & Domain Logic)                        │
├─────────────────────────────────────────────────────────────┤
│                     Utility Layer                            │
│           (Shared Functions & Utilities)                     │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│              (Fixtures & Test Data)                          │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                       │
│         (Constants, Config, Environment)                     │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Presentation Layer (`src/tests/`)

- **Purpose**: Test scripts that define test scenarios
- **Components**:
  - Smoke tests
  - Load tests
  - Stress tests
- **Dependencies**: Service Layer, Utility Layer

#### 2. Service Layer (`src/helpers/`)

- **Purpose**: Encapsulates business logic and domain operations
- **Components**:
  - RequestBuilder: HTTP request construction
  - ResponseValidator: Response validation logic
- **Dependencies**: Utility Layer, Infrastructure Layer

#### 3. Utility Layer (`src/utils/`)

- **Purpose**: Reusable utility functions
- **Components**:
  - Logger: Structured logging
  - Metrics: Custom k6 metrics
  - Validator: General validation functions
  - Config: Test configuration
- **Dependencies**: Infrastructure Layer

#### 4. Data Layer (`src/fixtures/`)

- **Purpose**: Test data and data generation
- **Components**:
  - data-generator: Dynamic test data creation
  - test-data: Static test fixtures
- **Dependencies**: None (pure data)

#### 5. Infrastructure Layer (`src/config/`, `src/constants/`)

- **Purpose**: Configuration and constants
- **Components**:
  - Environment configuration
  - Constants and enums
  - Type definitions
- **Dependencies**: None (foundational)

## Component Details

### RequestBuilder

**Responsibility**: Construct HTTP requests with proper headers and parameters

```typescript
class RequestBuilder {
  - baseUrl: string
  - headers: Record<string, string>

  + setHeader(key, value): RequestBuilder
  + setHeaders(headers): RequestBuilder
  + setBearerToken(token): RequestBuilder
  + buildUrl(endpoint, queryParams): string
  + buildPayload(data): string
  + getHeaders(): Record<string, string>
  + clone(): RequestBuilder
}
```

**Design Pattern**: Builder Pattern for fluent API

**Usage**:

```typescript
const request = new RequestBuilder(baseUrl)
  .setBearerToken(token)
  .setHeader("X-Custom", "value")
  .buildUrl("/api/users", { page: "1" });
```

### ResponseValidator

**Responsibility**: Validate HTTP responses against expected criteria

```typescript
class ResponseValidator {
  + static isSuccessful(statusCode): boolean
  + static isClientError(statusCode): boolean
  + static isServerError(statusCode): boolean
  + static hasRequiredFields(response, fields): ValidationResult
  + static isValidJson(response): boolean
  + static meetsPerformanceThresholds(time, threshold): boolean
  + static validateResponse(status, body, fields, maxDuration): ValidationResult
}
```

**Design Pattern**: Static utility class

**Usage**:

```typescript
const validation = ResponseValidator.validateResponse(
  response.status,
  response.body,
  ["id", "name"],
  500
);
```

### Logger

**Responsibility**: Provide structured logging with multiple levels

```typescript
class Logger {
  - context: string
  - logLevel: LogLevel

  + debug(message, context?): void
  + info(message, context?): void
  + warn(message, context?): void
  + error(message, context?): void
  + step(step, details?): void
  + logRequest(method, url, status, duration): void
  + setLogLevel(level): void
}
```

**Design Pattern**: Logger Pattern with context

**Usage**:

```typescript
const logger = new Logger("MyTest");
logger.info("Test started");
logger.logRequest("GET", url, 200, 150);
```

### Environment Configuration

**Responsibility**: Manage environment-specific settings

```typescript
enum Environment {
  DEVELOPMENT,
  STAGING,
  PRODUCTION,
}

interface EnvironmentConfig {
  name: Environment;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  logLevel: string;
  enableMetrics: boolean;
}
```

**Design Pattern**: Strategy Pattern for environment selection

## Data Flow

### Test Execution Flow

```
┌──────────────┐
│ Test Script  │
└──────┬───────┘
       │
       ├─ 1. setup()
       │     └─> Initialize data, authenticate
       │
       ├─ 2. default function (main test)
       │     │
       │     ├─> RequestBuilder.buildUrl()
       │     ├─> http.get/post()
       │     ├─> ResponseValidator.validate()
       │     ├─> check()
       │     ├─> Logger.log()
       │     └─> customMetrics.add()
       │
       ├─ 3. teardown()
       │     └─> Cleanup, final logging
       │
       └─ 4. handleSummary()
             └─> Generate reports
```

### Request Flow

```
Test Script
    │
    ├─> RequestBuilder
    │      ├─> setHeaders()
    │      ├─> buildUrl()
    │      └─> buildPayload()
    │
    ├─> k6.http
    │      └─> Execute HTTP request
    │
    ├─> ResponseValidator
    │      ├─> validateStatus()
    │      ├─> validateFields()
    │      └─> validatePerformance()
    │
    ├─> Logger
    │      └─> logRequest()
    │
    └─> CustomMetrics
           └─> add()
```

## Extension Points

### Adding New Test Types

1. Create test file in `src/tests/`
2. Define scenario in `src/utils/config.ts`
3. Add webpack entry in `webpack.config.js`
4. Add npm script in `package.json`

### Adding New Helpers

1. Create helper class in `src/helpers/`
2. Add unit tests in `src/helpers/__tests__/`
3. Export from helper file
4. Document usage

### Adding New Utilities

1. Create utility in `src/utils/`
2. Add unit tests in `src/utils/__tests__/`
3. Export from utility file
4. Update architecture docs

### Adding Custom Metrics

1. Define metric in `src/utils/metrics.ts`
2. Use in test scripts with `.add()`
3. Configure thresholds in test options
4. Document expected values

## Best Practices

### Component Communication

- **Loose Coupling**: Components should not directly depend on implementations
- **Interface Segregation**: Use small, focused interfaces
- **Dependency Injection**: Pass dependencies through constructors
- **Immutability**: Prefer immutable data structures

### Error Handling

```typescript
// Good: Handle errors gracefully
try {
  const result = operation();
  logger.info("Operation successful", { result });
} catch (error) {
  logger.error("Operation failed", { error });
  customMetrics.errorRate.add(1);
}

// Bad: Silent failures
const result = operation(); // May throw unhandled error
```

### Testing Strategy

```
Unit Tests (Jest)
    ├─> Test individual functions
    ├─> Mock external dependencies
    └─> Fast execution (<1s)

Integration Tests (k6)
    ├─> Test component interactions
    ├─> Use real HTTP calls
    └─> Moderate execution (seconds to minutes)

Performance Tests (k6)
    ├─> Test system behavior under load
    ├─> Real environment
    └─> Long execution (minutes to hours)
```

## Technology Stack

- **k6**: Load testing tool
- **TypeScript**: Type-safe JavaScript
- **Webpack**: Module bundler
- **Jest**: Unit testing framework
- **Prettier**: Code formatter
- **GitHub Actions**: CI/CD platform

## Future Enhancements

Potential areas for extension:

1. **GraphQL Support**: Add GraphQL request builders
2. **WebSocket Testing**: Support for WebSocket protocols
3. **Database Validators**: Direct database assertion utilities
4. **Visual Reports**: HTML report generation
5. **Distributed Testing**: Multi-region execution
6. **Real-time Monitoring**: Live test execution dashboards

## References

- [k6 Documentation](https://k6.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
