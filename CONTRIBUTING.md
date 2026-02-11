# Contributing to MCP Discovery

Thank you for your interest in contributing! This document will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mcp-discovery-v2.git
   cd mcp-discovery-v2
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

## How to Contribute

### Reporting Bugs

- Check if the bug is already reported
- Open a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details (OS, Node version)

### Suggesting Features

- Open an issue with the "feature request" label
- Describe the use case
- Explain why it would be valuable

### Pull Requests

1. Create a new branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes

3. Add tests if applicable

4. Commit with clear message:
   ```bash
   git commit -m "feat: add category filtering"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```

6. Open a Pull Request

## Commit Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding tests
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

## Project Structure

```
mcp-discovery-v2/
├── src/              # Source code
│   ├── index.ts      # Main exports
│   ├── discovery.ts  # Discovery client
│   └── types.ts      # Type definitions
├── tests/            # Test files
├── docs/             # Documentation
├── examples/         # Usage examples
└── .github/          # GitHub Actions
```

## Adding a New Feature

### Example: Adding a new API endpoint

1. Add types to `src/types.ts`
2. Implement in `src/discovery.ts`
3. Add tests in `tests/`
4. Update documentation
5. Add example usage

## Code Style

- TypeScript strict mode
- ESLint rules enforced
- Prettier for formatting

## Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- discovery.test.ts

# Run with coverage
npm test -- --coverage
```

## Documentation

- Update README.md if changing public API
- Add JSDoc comments for functions
- Update examples if behavior changes

## Questions?

- Open a Discussion on GitHub
- Or email: yksanjo@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
