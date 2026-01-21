# CV Genius - Clean Architecture Implementation Complete

## Overview

CV Genius has been successfully refactored to follow **Clean Architecture** and **Domain-Driven Design (DDD)** principles. This document provides a complete guide to the new architecture.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)

**Purpose**: Enterprise business rules - the core of the application.

**Characteristics**:
- Framework independent
- No external dependencies
- Pure TypeScript/JavaScript
- Zod validation schemas

**Structure**:
```
domain/
├── entities/           # Business objects with identity
│   ├── index.ts
│   ├── CVData.ts      # Aggregate root
│   ├── Experience.ts
│   ├── Education.ts
│   ├── Skill.ts
│   ├── Language.ts
│   └── Certificate.ts
├── value-objects/     # Immutable value types
│   ├── index.ts
│   ├── SkillLevel.ts
│   ├── LanguageProficiency.ts
│   └── CVTemplate.ts
└── interfaces/        # Repository contracts
    ├── index.ts
    ├── ICVRepository.ts
    ├── IAuthRepository.ts
    └── IAIRepository.ts
```

**Import Aliases**:
```typescript
import { CVData, Experience, Education } from '@domain/entities';
import { SkillLevel, LanguageProficiency } from '@domain/value-objects';
import { ICVRepository, IAuthRepository } from '@domain/interfaces';
```

### 2. Application Layer (`src/application/`)

**Purpose**: Application business rules - orchestrates the flow of data.

**Characteristics**:
- Use cases (single responsibility)
- Application state (contexts)
- React Query hooks
- Error handling

**Structure**:
```
application/
├── use-cases/         # Business logic operations
│   ├── cv/
│   │   ├── index.ts
│   │   ├── CreateCVUseCase.ts
│   │   ├── UpdateCVUseCase.ts
│   │   └── DeleteCVUseCase.ts
│   ├── ai/
│   │   ├── index.ts
│   │   ├── AnalyzeCVUseCase.ts
│   │   └── ParseCVTextUseCase.ts
│   └── auth/
│       ├── index.ts
│       ├── SignInUseCase.ts
│       └── SignUpUseCase.ts
├── context/           # React contexts
│   ├── index.ts
│   ├── CVDataContext.tsx
│   ├── CVActionsContext.tsx
│   ├── CVUIContext.tsx
│   ├── AIContext.tsx
│   └── VersionContext.tsx
├── hooks/             # React Query hooks
│   ├── cv/
│   │   ├── index.ts
│   │   ├── useUserCVs.ts
│   │   ├── useCreateCV.ts
│   │   └── useUpdateCV.ts
│   ├── ai/
│   │   ├── index.ts
│   │   └── useAnalyzeCV.ts
│   ├── performance/
│   │   ├── index.ts
│   │   ├── useDebounce.ts
│   │   └── useThrottle.ts
│   └── queries/
│       └── queryKeys.ts
├── errors/            # Error handling
│   ├── index.ts
│   ├── AppError.ts
│   ├── errorMessages.ts
│   └── errorLogger.ts
└── providers/
    └── AppProviders.tsx
```

**Import Aliases**:
```typescript
import { CreateCVUseCase, DeleteCVUseCase } from '@application/use-cases/cv';
import { useCVData, useCVActions } from '@application/context';
import { useUserCVs, useCreateCV } from '@application/hooks/cv';
import { AppError, ValidationError } from '@application/errors';
```

### 3. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Frameworks & drivers - external interfaces.

**Characteristics**:
- Repository implementations
- Database access
- External APIs
- Dependency injection

**Structure**:
```
infrastructure/
├── repositories/      # Repository implementations
│   ├── index.ts
│   ├── SupabaseCVRepository.ts
│   ├── SupabaseAuthRepository.ts
│   └── OpenAIRepository.ts
└── di/               # Dependency injection
    └── container.ts
```

**Import Aliases**:
```typescript
import { SupabaseCVRepository } from '@infrastructure/repositories';
import { getCVRepository, getAuthRepository } from '@infrastructure/di/container';
```

### 4. Presentation Layer (`src/presentation/`)

**Purpose**: Interface adapters - UI components and pages.

**Characteristics**:
- React components
- Pages
- Routes
- UI-specific hooks

**Structure**:
```
presentation/
├── components/
│   ├── common/        # Reusable components
│   │   ├── Suspense.tsx
│   │   └── LazyImage.tsx
│   ├── error/         # Error handling UI
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorFallback.tsx
│   │   └── GlobalErrorHandler.tsx
│   └── templates/     # CV templates
│       ├── index.ts
│       ├── templateLoader.ts
│       └── ModernTemplate.tsx
├── routes/            # Routing
│   ├── index.ts
│   └── lazyRoutes.ts
└── hooks/             # UI hooks
    └── useErrorHandler.ts
```

**Import Aliases**:
```typescript
import { ErrorBoundary, GlobalErrorHandler } from '@presentation/components/error';
import { Suspense, LazyImage } from '@presentation/components/common';
import { LazyDashboard, LazyBuilder } from '@presentation/routes';
```

### 5. Shared Layer (`src/shared/`)

**Purpose**: Shared utilities that don't belong to specific layers.

**Structure**:
```
shared/
├── lib/               # Utility functions
│   └── index.ts
└── types/             # Shared types
    └── index.ts
```

**Import Aliases**:
```typescript
import { cn, formatDate } from '@shared/lib';
import { SubscriptionPlan } from '@shared/types';
```

### 6. Tests (`src/__tests__/`)

**Purpose**: Test suites organized by layer.

**Structure**:
```
__tests__/
├── domain/            # Domain tests
│   ├── entities/
│   └── value-objects/
├── application/       # Application tests
│   └── use-cases/
├── presentation/      # Presentation tests
│   ├── components/
│   └── hooks/
├── mocks/             # Test mocks
│   ├── repositories.ts
│   └── handlers.ts
├── utils/             # Test utilities
│   └── testUtils.tsx
└── setup.ts           # Test setup
```

**Import Aliases**:
```typescript
import { renderWithProviders } from '@tests/utils/testUtils';
import { createMockCVRepository } from '@tests/mocks/repositories';
```

## Dependency Flow

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                 │
│           (React Components, Pages, UI)             │
└────────────────────┬────────────────────────────────┘
                     │ depends on
┌────────────────────▼────────────────────────────────┐
│                 Application Layer                   │
│     (Use Cases, Contexts, Hooks, Errors)            │
└────────────────────┬────────────────────────────────┘
                     │ depends on
┌────────────────────▼────────────────────────────────┐
│                   Domain Layer                      │
│  (Entities, Value Objects, Business Rules)          │
└─────────────────────────────────────────────────────┘
                     ▲
                     │ implements
┌────────────────────┴────────────────────────────────┐
│              Infrastructure Layer                   │
│    (Repositories, Database, External Services)      │
└─────────────────────────────────────────────────────┘
```

**Key Principle**: Dependencies only point inward. Domain layer has no dependencies.

## Path Aliases

All layers have dedicated path aliases for clean imports:

```json
{
  "@/*": ["./src/*"],              // General
  "@domain/*": ["./src/domain/*"], // Domain layer
  "@application/*": ["./src/application/*"], // Application layer
  "@infrastructure/*": ["./src/infrastructure/*"], // Infrastructure layer
  "@presentation/*": ["./src/presentation/*"], // Presentation layer
  "@shared/*": ["./src/shared/*"], // Shared utilities
  "@tests/*": ["./src/__tests__/*"] // Tests
}
```

## Import Patterns

### Old Way (Before Refactoring)
```typescript
// Scattered imports
import { CV } from '@/types/cv';
import { useCVContext } from '@/context/CVContext';
import { cvService } from '@/services/cvService';
```

### New Way (Clean Architecture)
```typescript
// Layer-based imports
import { CVData, Experience } from '@domain/entities';
import { CreateCVUseCase } from '@application/use-cases/cv';
import { useCVData, useCVActions } from '@application/context';
import { useUserCVs, useCreateCV } from '@application/hooks/cv';
```

## Benefits

### 1. **Maintainability**
- Clear separation of concerns
- Easy to locate files
- Consistent patterns

### 2. **Testability**
- Business logic isolated from UI
- Easy to mock dependencies
- Layer-specific tests

### 3. **Scalability**
- Add features without changing core
- Swap implementations easily
- Independent layer evolution

### 4. **Developer Experience**
- Semantic imports
- IntelliSense support
- Self-documenting structure

## File Organization Rules

### Domain Layer
- ✅ Pure TypeScript/JavaScript
- ✅ Zod validation schemas
- ✅ No framework dependencies
- ❌ No React imports
- ❌ No external API calls

### Application Layer
- ✅ Use cases with single responsibility
- ✅ React hooks and contexts
- ✅ Business logic orchestration
- ❌ No UI components
- ❌ No direct database access

### Infrastructure Layer
- ✅ Repository implementations
- ✅ Database queries
- ✅ External API calls
- ❌ No business logic
- ❌ No UI components

### Presentation Layer
- ✅ React components
- ✅ Pages and routes
- ✅ UI-specific logic
- ❌ No business logic
- ❌ No direct database access

## Migration Guide

### Step 1: Update Imports

Replace old imports with layer-based aliases:

```typescript
// Before
import { CVData } from '@/types/cv';
import { useCVContext } from '@/context/CVContext';

// After
import { CVData } from '@domain/entities';
import { useCVData } from '@application/context';
```

### Step 2: Use Use Cases

Replace direct service calls with use cases:

```typescript
// Before
import { cvService } from '@/services/cvService';
const cv = await cvService.createCV(data);

// After
import { useCreateCV } from '@application/hooks/cv';
const createCV = useCreateCV();
await createCV.mutateAsync(data);
```

### Step 3: Use Contexts

Use separated contexts instead of monolithic context:

```typescript
// Before
const { cvData, addExperience, currentSection } = useCVContext();

// After
const { cvData } = useCVData();
const { addExperience } = useCVActions();
const { currentSection } = useCVUI();
```

## Common Patterns

### 1. Creating a New Feature

```typescript
// 1. Define domain entities
// src/domain/entities/NewFeature.ts
export interface NewFeature {
  id: string;
  name: string;
}

// 2. Create use case
// src/application/use-cases/feature/CreateFeatureUseCase.ts
export class CreateFeatureUseCase {
  constructor(private repo: IFeatureRepository) {}
  async execute(input) { /* ... */ }
}

// 3. Create React Query hook
// src/application/hooks/feature/useCreateFeature.ts
export const useCreateFeature = () => {
  return useMutation({
    mutationFn: async (input) => {
      const useCase = getCreateFeatureUseCase();
      return useCase.execute(input);
    },
  });
};

// 4. Use in component
// src/presentation/components/FeatureForm.tsx
const createFeature = useCreateFeature();
await createFeature.mutateAsync(data);
```

### 2. Adding a New Repository

```typescript
// 1. Define interface in domain
// src/domain/interfaces/INewRepository.ts
export interface INewRepository {
  get(id: string): Promise<Data>;
}

// 2. Implement in infrastructure
// src/infrastructure/repositories/SupabaseNewRepository.ts
export class SupabaseNewRepository implements INewRepository {
  async get(id: string) { /* ... */ }
}

// 3. Register in DI container
// src/infrastructure/di/container.ts
export const getNewRepository = () => new SupabaseNewRepository();
```

### 3. Adding a New Context

```typescript
// 1. Create context
// src/application/context/NewContext.tsx
export const NewContext = createContext<NewContextType | undefined>(undefined);

// 2. Export hook
export const useNew = () => {
  const context = useContext(NewContext);
  if (!context) throw new Error('useNew must be used within NewProvider');
  return context;
};

// 3. Add to AppProviders
// src/application/providers/AppProviders.tsx
<NewProvider>
  {children}
</NewProvider>
```

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture guide (Turkish)
- [PERFORMANCE.md](PERFORMANCE.md) - Performance optimization guide
- [TESTING.md](TESTING.md) - Testing guide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Migration from old to new structure
- [USE_CASES_GUIDE.md](USE_CASES_GUIDE.md) - Use cases documentation

## Quick Reference

### Most Common Imports

```typescript
// Domain
import { CVData, Experience, Education } from '@domain/entities';
import { SkillLevel, CVTemplate } from '@domain/value-objects';

// Application
import { useCVData, useCVActions, useCVUI } from '@application/context';
import { useUserCVs, useCreateCV, useUpdateCV } from '@application/hooks/cv';
import { AppError, ValidationError } from '@application/errors';

// Infrastructure
import { getCVRepository } from '@infrastructure/di/container';

// Presentation
import { ErrorBoundary } from '@presentation/components/error';
import { Suspense } from '@presentation/components/common';
```

### Layer Communication

```typescript
// Presentation → Application
const Component = () => {
  const { data } = useUserCVs(); // React Query hook
  const { cvData } = useCVData(); // Context
  return <div>{/* UI */}</div>;
};

// Application → Domain
export class CreateCVUseCase {
  async execute(input) {
    const validated = CVDataSchema.parse(input); // Domain validation
    return this.repository.create(validated); // Repository call
  }
}

// Infrastructure → Domain
export class SupabaseCVRepository implements ICVRepository {
  async create(data: CVData) { // Domain interface
    // Database implementation
  }
}
```

## Summary

CV Genius now follows Clean Architecture with:

- ✅ **4 Clear Layers**: Domain, Application, Infrastructure, Presentation
- ✅ **Layer-Based Path Aliases**: `@domain/*`, `@application/*`, etc.
- ✅ **120+ Files** organized by responsibility
- ✅ **Comprehensive Tests** for all layers
- ✅ **Full Backward Compatibility** with deprecation wrappers
- ✅ **Performance Optimizations**: Code splitting, lazy loading, debouncing
- ✅ **Error Handling**: Multi-layer error system with i18n
- ✅ **Documentation**: Extensive guides for all aspects

The architecture is production-ready, maintainable, and scalable! 🚀
