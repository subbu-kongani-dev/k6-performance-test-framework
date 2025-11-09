# Contributing to K6 Performance Test Framework

First off, thank you for considering contributing to the K6 Performance Test Framework! It's people like you that make this framework such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template**:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Run command '...'
2. See error

**Expected behavior**
A clear description of what you expected to happen.

**Environment**

- OS: [e.g., macOS 13.0]
- Node.js version: [e.g., 18.16.0]
- k6 version: [e.g., 0.48.0]
- Framework version: [e.g., 1.0.0]

**Logs**
```

Paste relevant logs here

```

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear and descriptive title**
- **Detailed description** of the proposed feature
- **Use cases** explaining why this would be useful
- **Possible implementation** if you have ideas

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if you've added code that should be tested
4. **Ensure all tests pass** by running `npm test`
5. **Update documentation** if you've changed APIs
6. **Follow the commit message conventions** (see below)
7. **Submit the pull request**

## Development Setup

1. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/k6-performance-test-framework.git
   cd k6-performance-test-framework
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a branch**

   ```bash
   git checkout -b feature/my-new-feature
   ```

4. **Make your changes** and commit

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Run tests**

   ```bash
   npm run test:unit
   npm run lint
   npm run format:check
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/my-new-feature
   ```

7. **Create a Pull Request**

## Coding Standards

### TypeScript Style Guide

- Use **TypeScript** for all new code
- Follow **strict type checking**
- Use **meaningful variable names**
- Add **JSDoc comments** for public APIs

```typescript
/**
 * Validates if a URL is properly formatted
 * @param url - The URL to validate
 * @returns true if valid, false otherwise
 * @throws {Error} If the URL is null or undefined
 */
export function validateUrl(url: string): boolean {
  // Implementation
}
```

### Code Formatting

- Use **Prettier** for code formatting (configured in `.prettierrc.json`)
- Run `npm run format` before committing
- Use **2 spaces** for indentation
- Use **semicolons**
- Use **double quotes** for strings

### Testing

- Write **unit tests** for all utilities and helpers
- Maintain **>80% code coverage**
- Use **descriptive test names**
- Follow the **Arrange-Act-Assert** pattern

```typescript
describe("RequestBuilder", () => {
  it("should build URL with query parameters", () => {
    // Arrange
    const builder = new RequestBuilder("https://api.example.com");
    const params = { page: "1", limit: "10" };

    // Act
    const url = builder.buildUrl("/users", params);

    // Assert
    expect(url).toBe("https://api.example.com/users?page=1&limit=10");
  });
});
```

### k6 Test Guidelines

- Use **descriptive test names** and comments
- Include **setup** and **teardown** functions
- Add **comprehensive checks** for response validation
- Use **custom metrics** for business KPIs
- Include **think time** for realistic scenarios

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(helpers): add request retry mechanism

Add automatic retry for failed requests with exponential backoff.
Includes configurable max retries and delay settings.

Closes #123
```

```
fix(validator): correct URL validation regex

The previous regex was not handling IPv6 addresses correctly.
Updated to support both IPv4 and IPv6 formats.
```

## Project Structure

```
src/
├── config/          # Environment and configuration
├── constants/       # Constants and enums
├── fixtures/        # Test data and generators
├── helpers/         # Request builders and validators
├── tests/           # k6 test suites
└── utils/           # Utilities and common functions
```

### Adding New Features

#### 1. Adding a New Helper

```typescript
// src/helpers/my-helper.ts
import { Logger } from "../utils/logger";

/**
 * Helper description
 */
export class MyHelper {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("MyHelper");
  }

  // Implementation
}
```

#### 2. Adding a New Test

```typescript
// src/tests/my-test.ts
import http from "k6/http";
import { check } from "k6";
import { Logger } from "../utils/logger";

const logger = new Logger("MyTest");

export const options = {
  // k6 options
};

export default function () {
  logger.info("Running test");
  // Test implementation
}
```

#### 3. Adding Unit Tests

```typescript
// src/helpers/__tests__/my-helper.test.ts
import { MyHelper } from "../my-helper";

describe("MyHelper", () => {
  it("should do something", () => {
    const helper = new MyHelper();
    expect(helper.doSomething()).toBe(expected);
  });
});
```

## Documentation

- Update **README.md** for user-facing changes
- Add **JSDoc comments** to all public functions
- Update **inline comments** for complex logic
- Create **examples** for new features

## Review Process

All submissions require review. We use GitHub pull requests for this purpose:

1. **Automated checks** must pass (tests, linting, formatting)
2. **Code review** by at least one maintainer
3. **Documentation** must be updated if needed
4. **Tests** must be included for new features
5. **No merge conflicts** with main branch

## Recognition

Contributors will be recognized in:

- The project's **README.md** (if significant contribution)
- GitHub **Contributors** page
- Release notes (for features/fixes in releases)

## Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Create an issue for bugs or feature requests
- 📧 **Email**: Contact maintainers for sensitive topics

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make performance testing better for everyone! 🚀
