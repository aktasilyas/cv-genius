# Testing Guide

This document provides comprehensive information about testing in CV Genius, including test structure, best practices, and how to run tests.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Running Tests](#running-tests)
3. [Test Types](#test-types)
4. [Writing Tests](#writing-tests)
5. [Mocking](#mocking)
6. [Coverage](#coverage)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Test Structure

Tests are organized by layer following Clean Architecture:

```
src/__tests__/
├── domain/                    # Domain layer tests
│   ├── entities/             # Entity tests
│   │   ├── Experience.test.ts
│   │   ├── Education.test.ts
│   │   └── CVData.test.ts
│   └── value-objects/        # Value object tests
│       └── SkillLevel.test.ts
├── application/              # Application layer tests
│   └── use-cases/           # Use case tests
│       ├── cv/
│       │   ├── CreateCVUseCase.test.ts
│       │   └── DeleteCVUseCase.test.ts
│       └── ai/
│           └── AnalyzeCVUseCase.test.ts
├── infrastructure/          # Infrastructure layer tests
│   └── repositories/
│       └── SupabaseCVRepository.test.ts
├── presentation/            # Presentation layer tests
│   ├── components/
│   │   ├── CVPreview.test.tsx
│   │   └── ErrorBoundary.test.tsx
│   └── hooks/
│       ├── useUserCVs.test.tsx
│       └── useCreateCV.test.tsx
├── mocks/                   # Test mocks
│   ├── repositories.ts
│   └── handlers.ts
└── utils/                   # Test utilities
    └── testUtils.tsx
```

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests with coverage in watch mode
npm run test:coverage:watch
```

### Layer-Specific Tests

```bash
# Run domain layer tests only
npm run test:domain

# Run application layer tests only
npm run test:application

# Run presentation layer tests only
npm run test:presentation
```

### File-Specific Tests

```bash
# Run specific test file
npx vitest run src/__tests__/domain/entities/Experience.test.ts

# Run tests matching pattern
npx vitest run -t "CreateCVUseCase"
```

## Test Types

### 1. Unit Tests

Test individual units in isolation.

**Example: Domain Entity Test**

```typescript
import { describe, it, expect } from 'vitest';
import { createExperience } from '@/domain/entities/Experience';

describe('Experience Entity', () => {
  it('should create experience with defaults', () => {
    const experience = createExperience({
      company: 'Test Corp',
      position: 'Developer',
    });

    expect(experience.company).toBe('Test Corp');
    expect(experience.id).toBeDefined();
    expect(experience.current).toBe(false);
  });
});
```

### 2. Integration Tests

Test how units work together.

**Example: Use Case Test**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCVUseCase } from '@/application/use-cases/cv/CreateCVUseCase';
import { createMockCVRepository } from '@/__tests__/mocks/repositories';

describe('CreateCVUseCase', () => {
  let useCase: CreateCVUseCase;
  let mockRepository: ReturnType<typeof createMockCVRepository>;

  beforeEach(() => {
    mockRepository = createMockCVRepository();
    useCase = new CreateCVUseCase(mockRepository);
  });

  it('should create CV with valid data', async () => {
    const result = await useCase.execute({
      title: 'My CV',
      cvData: initialCVData,
      template: 'modern',
    });

    expect(result.cv).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
```

### 3. Component Tests

Test React components.

**Example: Component Test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/presentation/components/error';

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

### 4. Hook Tests

Test custom React hooks.

**Example: Hook Test**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserCVs } from '@/application/hooks/cv/useUserCVs';
import { QueryWrapper } from '@/__tests__/utils/testUtils';

describe('useUserCVs', () => {
  it('should fetch user CVs', async () => {
    const { result } = renderHook(() => useUserCVs(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.cvs).toBeDefined();
  });
});
```

## Writing Tests

### Test Structure

Follow the **Arrange-Act-Assert** pattern:

```typescript
it('should do something', () => {
  // Arrange - Set up test data
  const input = { title: 'Test' };

  // Act - Perform the action
  const result = someFunction(input);

  // Assert - Verify the result
  expect(result).toBe(expected);
});
```

### Test Naming

Use descriptive test names:

```typescript
// ✅ Good
it('should throw ValidationError when title is empty', () => {});
it('should create CV with default template when not specified', () => {});

// ❌ Bad
it('test 1', () => {});
it('should work', () => {});
```

### Test Organization

Group related tests with `describe`:

```typescript
describe('CreateCVUseCase', () => {
  describe('validation', () => {
    it('should validate title', () => {});
    it('should validate CV data', () => {});
  });

  describe('creation', () => {
    it('should create CV successfully', () => {});
    it('should set default values', () => {});
  });
});
```

### Setup and Teardown

Use hooks for common setup:

```typescript
describe('MyTest', () => {
  beforeEach(() => {
    // Run before each test
  });

  afterEach(() => {
    // Run after each test
  });

  beforeAll(() => {
    // Run once before all tests
  });

  afterAll(() => {
    // Run once after all tests
  });
});
```

## Mocking

### Mock Repositories

Use pre-built mock repositories:

```typescript
import { createMockCVRepository } from '@/__tests__/mocks/repositories';

const mockRepo = createMockCVRepository();

// Customize mock behavior
mockRepo.getById.mockResolvedValue(customCV);
```

### Mock Functions

```typescript
import { vi } from 'vitest';

// Create mock function
const mockFn = vi.fn();

// Mock implementation
mockFn.mockImplementation((x) => x * 2);

// Mock resolved value
mockFn.mockResolvedValue({ data: 'test' });

// Mock rejected value
mockFn.mockRejectedValue(new Error('Failed'));
```

### Mock Modules

```typescript
// Mock entire module
vi.mock('@/infrastructure/di/container', () => ({
  getCVRepository: () => createMockCVRepository(),
}));

// Mock specific exports
vi.mock('@/domain/entities/Experience', async () => {
  const actual = await vi.importActual('@/domain/entities/Experience');
  return {
    ...actual,
    createExperience: vi.fn(),
  };
});
```

### Mock Timers

```typescript
import { vi } from 'vitest';

describe('Debounce test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 1000);

    debounced();
    debounced();
    debounced();

    vi.advanceTimersByTime(1000);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

## Coverage

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
coverage: {
  lines: 70,
  functions: 70,
  branches: 70,
  statements: 70,
}
```

### Interpreting Coverage

- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of if/else branches taken
- **Statements**: Percentage of statements executed

### Excluded from Coverage

- Node modules
- Test files
- Type definitions
- Configuration files
- Mock data

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good: Tests behavior
it('should display user name', () => {
  render(<UserProfile user={mockUser} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

// ❌ Bad: Tests implementation
it('should set state', () => {
  const component = shallow(<UserProfile user={mockUser} />);
  expect(component.state('name')).toBe('John Doe');
});
```

### 2. Keep Tests Independent

```typescript
// ✅ Good: Independent tests
describe('Calculator', () => {
  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should subtract numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});

// ❌ Bad: Tests depend on each other
describe('Calculator', () => {
  let result;

  it('should add numbers', () => {
    result = add(2, 3);
    expect(result).toBe(5);
  });

  it('should use previous result', () => {
    expect(subtract(result, 2)).toBe(3);
  });
});
```

### 3. Use Meaningful Assertions

```typescript
// ✅ Good: Specific assertions
expect(result.cvs).toHaveLength(3);
expect(result.cvs[0].title).toBe('My CV');

// ❌ Bad: Vague assertions
expect(result).toBeTruthy();
expect(result.cvs.length > 0).toBe(true);
```

### 4. Test Edge Cases

```typescript
describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('should handle empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should handle null', () => {
    expect(validateEmail(null)).toBe(false);
  });
});
```

### 5. Use Test Utilities

```typescript
// ✅ Good: Use test utilities
import { renderWithProviders } from '@/__tests__/utils/testUtils';

it('should render with all providers', () => {
  renderWithProviders(<MyComponent />);
});

// ❌ Bad: Repeat provider setup
it('should render', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    </QueryClientProvider>
  );
});
```

### 6. Clean Up After Tests

```typescript
describe('LocalStorage test', () => {
  afterEach(() => {
    // Clean up
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save to localStorage', () => {
    saveData('key', 'value');
    expect(localStorage.getItem('key')).toBe('value');
  });
});
```

### 7. Test Error Scenarios

```typescript
describe('CreateCVUseCase', () => {
  it('should handle successful creation', async () => {
    // Test happy path
  });

  it('should throw ValidationError for invalid data', async () => {
    // Test validation errors
    await expect(useCase.execute(invalidInput)).rejects.toThrow(ValidationError);
  });

  it('should handle repository errors', async () => {
    // Test error handling
    mockRepo.create.mockRejectedValue(new Error('DB Error'));
    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
```

## Troubleshooting

### Common Issues

#### Tests Failing with Module Not Found

```bash
# Check tsconfig paths are correctly set up
# Ensure vitest.config.ts has correct alias configuration

resolve: {
  alias: { "@": path.resolve(__dirname, "./src") },
}
```

#### Tests Timeout

```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // Test code
}, 10000); // 10 second timeout
```

#### Mock Not Working

```typescript
// Ensure mock is before import
vi.mock('@/module', () => ({
  export: mockValue
}));

// Import after mock
import { Component } from '@/module';
```

#### Coverage Not Updating

```bash
# Clear coverage cache
rm -rf coverage/
npm run test:coverage
```

### Debugging Tests

```typescript
// Use console.log
it('debug test', () => {
  console.log('Debug info:', value);
});

// Use debugger
it('debug test', () => {
  debugger; // Add breakpoint
});

// Run single test with --inspect
npx vitest run --inspect-brk src/__tests__/path/to/test.ts
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## Summary

CV Genius has a comprehensive test suite covering:

- **Domain Layer**: Entity and value object validation
- **Application Layer**: Use case business logic
- **Infrastructure Layer**: Repository implementations
- **Presentation Layer**: Components and hooks

Tests are organized by architecture layer, use mocks for dependencies, and follow best practices for maintainability and reliability.

Run `npm test` to execute all tests, or use layer-specific commands for targeted testing.
