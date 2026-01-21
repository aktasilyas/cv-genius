# Contributing to CV Genius

Thank you for your interest in contributing to CV Genius! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Architecture Guidelines](#architecture-guidelines)
5. [Code Style](#code-style)
6. [Testing](#testing)
7. [Commit Convention](#commit-convention)
8. [Pull Request Process](#pull-request-process)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Unprofessional conduct

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Supabase account (for backend features)

### Setup

1. **Fork the repository**

```bash
# Click "Fork" on GitHub
```

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/cv-genius.git
cd cv-genius
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/cv-genius.git
```

4. **Install dependencies**

```bash
npm install
```

5. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

6. **Start development server**

```bash
npm run dev
```

## Development Workflow

### Branch Strategy

We follow Git Flow with these branch types:

- `main` - Production-ready code
- `develop` - Development branch (not currently used, main is default)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code improvements
- `docs/*` - Documentation updates
- `test/*` - Test additions/improvements

### Creating a New Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions

- `feature/add-pdf-export` - New feature
- `fix/cv-preview-bug` - Bug fix
- `refactor/optimize-rendering` - Refactoring
- `docs/update-readme` - Documentation
- `test/add-domain-tests` - Tests

## Architecture Guidelines

CV Genius follows **Clean Architecture** with **Domain-Driven Design**. Please follow these guidelines:

### Layer Rules

#### 1. Domain Layer (`src/domain/`)

**Purpose**: Enterprise business rules

**Rules**:
- ✅ Pure TypeScript/JavaScript only
- ✅ Zod validation schemas
- ✅ No external dependencies
- ❌ No React imports
- ❌ No framework dependencies
- ❌ No API calls

**Example**:
```typescript
// ✅ Good: Pure domain entity
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
}

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: z.string().min(1),
  // ...
});

// ❌ Bad: React in domain
import { useState } from 'react';
export interface Experience { /* ... */ }
```

#### 2. Application Layer (`src/application/`)

**Purpose**: Application business rules

**Rules**:
- ✅ Use cases with single responsibility
- ✅ React hooks and contexts
- ✅ Business logic orchestration
- ❌ No UI components
- ❌ No direct database access

**Example**:
```typescript
// ✅ Good: Single responsibility use case
export class CreateCVUseCase {
  constructor(private readonly repository: ICVRepository) {}

  async execute(input: CreateCVInput): Promise<CreateCVOutput> {
    const validated = CVDataSchema.parse(input.cvData);
    const savedCV = await this.repository.create(validated, input.userId);
    return { cv: savedCV };
  }
}

// ❌ Bad: Multiple responsibilities
export class CVUseCase {
  create() { /* ... */ }
  update() { /* ... */ }
  delete() { /* ... */ }
  analyze() { /* ... */ }
}
```

#### 3. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: External interfaces

**Rules**:
- ✅ Repository implementations
- ✅ Database queries
- ✅ External API calls
- ❌ No business logic
- ❌ No UI components

**Example**:
```typescript
// ✅ Good: Clean repository implementation
export class SupabaseCVRepository implements ICVRepository {
  async getAll(userId: string): Promise<SavedCV[]> {
    const { data, error } = await this.supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new RepositoryError('Failed to fetch CVs', error);
    return data || [];
  }
}

// ❌ Bad: Business logic in repository
export class SupabaseCVRepository implements ICVRepository {
  async getAll(userId: string): Promise<SavedCV[]> {
    const { data } = await this.supabase.from('cvs').select('*');

    // Business logic - should be in use case!
    const filtered = data.filter(cv => cv.template === 'modern');
    const sorted = filtered.sort((a, b) => b.score - a.score);
    return sorted;
  }
}
```

#### 4. Presentation Layer (`src/presentation/`)

**Purpose**: User interface

**Rules**:
- ✅ React components
- ✅ Pages and routes
- ✅ UI-specific logic
- ❌ No business logic
- ❌ No direct database access

**Example**:
```typescript
// ✅ Good: Component uses hooks
const CVList: React.FC = () => {
  const { data: cvs, isLoading } = useUserCVs();
  const deleteCV = useDeleteCV();

  if (isLoading) return <Spinner />;

  return (
    <div>
      {cvs?.map(cv => (
        <CVCard key={cv.id} cv={cv} onDelete={deleteCV.mutate} />
      ))}
    </div>
  );
};

// ❌ Bad: Component with direct database access
const CVList: React.FC = () => {
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    // Direct database access - should use hook!
    supabase.from('cvs').select('*').then(({ data }) => setCvs(data));
  }, []);

  return <div>{/* ... */}</div>;
};
```

### Path Aliases

Always use layer-specific path aliases:

```typescript
// ✅ Good
import { CVData } from '@domain/entities';
import { useUserCVs } from '@application/hooks/cv';
import { getCVRepository } from '@infrastructure/di/container';
import { ErrorBoundary } from '@presentation/components/error';

// ❌ Bad
import { CVData } from '../../../domain/entities/CVData';
import { useUserCVs } from '../../application/hooks/cv/useUserCVs';
```

### Dependency Rule

Dependencies must only flow inward:

```
Presentation → Application → Domain ← Infrastructure
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over types for objects
- Use strict mode
- Avoid `any` - use `unknown` if needed

### React

- Use functional components
- Use hooks (not class components)
- Prefer named exports
- Use composition over inheritance

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
  - `CVPreview.tsx` (component)
  - `useUserCVs.ts` (hook)
  - `createEmptyCV.ts` (utility)

- **Components**: PascalCase
  ```typescript
  export const CVPreview: React.FC = () => { /* ... */ };
  ```

- **Hooks**: camelCase with `use` prefix
  ```typescript
  export const useUserCVs = () => { /* ... */ };
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  export const MAX_FILE_SIZE = 5 * 1024 * 1024;
  ```

- **Interfaces**: PascalCase with `I` prefix for repository interfaces
  ```typescript
  export interface ICVRepository { /* ... */ }
  export interface CreateCVInput { /* ... */ }
  ```

### Formatting

We use Prettier and ESLint. Run before committing:

```bash
npm run lint
```

## Testing

### Test Coverage Targets

- Domain Layer: **90%+**
- Application Layer: **80%+**
- Infrastructure Layer: **70%+**
- Presentation Layer: **60%+**

### Writing Tests

#### Domain Tests

```typescript
// src/__tests__/domain/entities/Experience.test.ts
import { describe, it, expect } from 'vitest';
import { ExperienceSchema, createExperience } from '@domain/entities';

describe('Experience Entity', () => {
  it('should validate correct experience data', () => {
    const valid = {
      id: '123',
      company: 'Tech Corp',
      position: 'Developer',
      startDate: new Date(),
    };

    const result = ExperienceSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid data', () => {
    const invalid = { company: '', position: 'Dev' };
    const result = ExperienceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
```

#### Use Case Tests

```typescript
// src/__tests__/application/use-cases/CreateCVUseCase.test.ts
import { describe, it, expect, vi } from 'vitest';
import { CreateCVUseCase } from '@application/use-cases/cv';
import { createMockCVRepository } from '@tests/mocks/repositories';

describe('CreateCVUseCase', () => {
  it('should create a CV successfully', async () => {
    const mockRepo = createMockCVRepository();
    const useCase = new CreateCVUseCase(mockRepo);

    const input = {
      cvData: { /* valid data */ },
      userId: 'user-123',
    };

    const result = await useCase.execute(input);

    expect(result.cv).toBeDefined();
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.any(Object),
      'user-123'
    );
  });
});
```

#### Component Tests

```typescript
// src/__tests__/presentation/components/CVPreview.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CVPreview } from '@presentation/components/cv';
import { renderWithProviders } from '@tests/utils/testUtils';

describe('CVPreview', () => {
  it('should render CV data', () => {
    const cvData = {
      personalInfo: { fullName: 'John Doe' },
      // ...
    };

    renderWithProviders(<CVPreview cvData={cvData} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With UI
npm run test:ui

# Coverage
npm run test:coverage

# Specific layer
npm run test:domain
npm run test:application
npm run test:presentation
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring
- `test` - Add/update tests
- `docs` - Documentation
- `style` - Formatting (no code change)
- `perf` - Performance improvement
- `chore` - Maintenance

### Examples

```bash
# Feature
git commit -m "feat(cv): add PDF export functionality"

# Bug fix
git commit -m "fix(preview): resolve template rendering issue"

# Refactoring
git commit -m "refactor(domain): simplify Experience entity validation"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Test
git commit -m "test(application): add CreateCVUseCase tests"

# With body
git commit -m "feat(ai): add CV analysis

Implements AI-powered CV analysis using OpenAI API.
Includes scoring, suggestions, and ATS optimization tips.

Closes #123"
```

### Commit Message Guidelines

- Use imperative mood ("add" not "added")
- Keep subject line under 50 characters
- Capitalize first letter
- No period at the end
- Provide context in body if needed
- Reference issues with "Closes #123"

## Pull Request Process

### Before Submitting

1. **Update your branch**

```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
```

2. **Run tests**

```bash
npm run test
npm run lint
```

3. **Build check**

```bash
npm run build
```

### Creating a Pull Request

1. **Push to your fork**

```bash
git push origin your-branch
```

2. **Open PR on GitHub**

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the template

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing

- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)

Add screenshots for UI changes

## Related Issues

Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address feedback by pushing new commits
3. Once approved, maintainers will merge

### After Merge

```bash
# Update your local main
git checkout main
git pull upstream main

# Delete your branch
git branch -d your-branch
git push origin --delete your-branch
```

## Additional Resources

- [Clean Architecture Guide](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Testing Guide](../TESTING.md)
- [Architecture Overview](../CLEAN_ARCHITECTURE_COMPLETE.md)

## Questions?

- Open an [issue](https://github.com/your-repo/issues)
- Check existing [discussions](https://github.com/your-repo/discussions)
- Read the [documentation](../README.md)

Thank you for contributing to CV Genius! 🎉
