# CV Genius Architecture Guide

This document provides a detailed breakdown of CV Genius's Clean Architecture implementation.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layer Details](#layer-details)
3. [Design Patterns](#design-patterns)
4. [Data Flow](#data-flow)
5. [Best Practices](#best-practices)

## Architecture Overview

CV Genius follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns. The architecture consists of four concentric layers:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (UI Components, Pages, Routes)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Application Layer                │
│  (Use Cases, Contexts, Hooks, Errors)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Domain Layer                   │
│  (Entities, Value Objects, Interfaces)  │
└──────────────▲──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│       Infrastructure Layer              │
│  (Repositories, Database, External APIs)│
└─────────────────────────────────────────┘
```

### Dependency Rule

Dependencies only flow inward:
- **Presentation** depends on **Application**
- **Application** depends on **Domain**
- **Infrastructure** implements **Domain** interfaces
- **Domain** has zero dependencies

## Layer Details

### 1. Domain Layer

**Location**: `src/domain/`

**Purpose**: Contains enterprise business rules that are independent of any framework, UI, or external service.

#### Entities

Business objects with identity and lifecycle:

```typescript
// src/domain/entities/CVData.ts
export interface CVData {
  id?: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  template: CVTemplate;
  customization?: TemplateCustomization;
}
```

**Key Entities**:
- `CVData` - Aggregate root
- `PersonalInfo` - Personal information
- `Experience` - Work experience
- `Education` - Educational background
- `Skill` - Technical and soft skills
- `Language` - Language proficiency
- `Certificate` - Certifications and awards

#### Value Objects

Immutable values without identity:

```typescript
// src/domain/value-objects/SkillLevel.ts
export const SkillLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;
```

**Key Value Objects**:
- `SkillLevel` - Skill proficiency levels
- `LanguageProficiency` - Language proficiency levels
- `CVTemplate` - Template types
- `DateRange` - Date range validation
- `CVCreationMode` - CV creation modes
- `PlanFeatures` - Subscription plan features

#### Interfaces

Repository contracts that define data access:

```typescript
// src/domain/interfaces/ICVRepository.ts
export interface ICVRepository {
  getAll(userId: string): Promise<SavedCV[]>;
  getById(id: string): Promise<SavedCV | null>;
  create(cvData: CVData, userId: string): Promise<SavedCV>;
  update(id: string, cvData: CVData): Promise<SavedCV>;
  delete(id: string): Promise<void>;
  setDefault(id: string): Promise<void>;
  duplicate(id: string): Promise<SavedCV>;
}
```

**Key Interfaces**:
- `ICVRepository` - CV data access
- `IAuthRepository` - Authentication
- `ISubscriptionRepository` - Subscription management
- `IAIService` - AI analysis service

### 2. Application Layer

**Location**: `src/application/`

**Purpose**: Implements application-specific business rules and orchestrates data flow between layers.

#### Use Cases

Single-responsibility operations that implement business logic:

```typescript
// src/application/use-cases/cv/CreateCVUseCase.ts
export class CreateCVUseCase {
  constructor(private readonly repository: ICVRepository) {}

  async execute(input: CreateCVInput): Promise<CreateCVOutput> {
    // 1. Validate input
    const validated = CVDataSchema.parse(input.cvData);

    // 2. Business logic
    const cvData = {
      ...validated,
      template: input.template || CVTemplate.MODERN,
    };

    // 3. Repository call
    const savedCV = await this.repository.create(cvData, input.userId);

    return { cv: savedCV };
  }
}
```

**Use Case Categories**:
- **CV Operations**: CreateCV, UpdateCV, DeleteCV, DuplicateCV
- **AI Operations**: AnalyzeCV, ParseCVText, GenerateContent
- **Auth Operations**: SignIn, SignUp, SignOut, ResetPassword

#### Contexts

React contexts for state management (split by concern):

```typescript
// src/application/context/CVDataContext.tsx
export const CVDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [cvData, setCvData] = useState<CVData>(createEmptyCV());

  return (
    <CVDataContext.Provider value={{ cvData, setCvData }}>
      {children}
    </CVDataContext.Provider>
  );
};
```

**Context Types**:
- `CVDataContext` - CV data state
- `CVActionsContext` - CV manipulation actions
- `CVUIContext` - UI state (current section, active element)
- `AIContext` - AI analysis state
- `VersionContext` - Version history

#### Hooks

React Query hooks for server state:

```typescript
// src/application/hooks/cv/useUserCVs.ts
export const useUserCVs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.cv.list(user?.id),
    queryFn: async () => {
      const repository = getCVRepository();
      return repository.getAll(user!.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Hook Categories**:
- **CV Hooks**: useUserCVs, useCreateCV, useUpdateCV, useDeleteCV
- **AI Hooks**: useAnalyzeCV, useParseText
- **Performance Hooks**: useDebounce, useThrottle, useMemoizedValue

#### Error Handling

Multi-layer error system with i18n:

```typescript
// src/application/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super('VALIDATION_ERROR', message, originalError);
    this.name = 'ValidationError';
  }
}
```

### 3. Infrastructure Layer

**Location**: `src/infrastructure/`

**Purpose**: Implements external interfaces like databases, APIs, and frameworks.

#### Repositories

Concrete implementations of domain interfaces:

```typescript
// src/infrastructure/repositories/SupabaseCVRepository.ts
export class SupabaseCVRepository implements ICVRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getAll(userId: string): Promise<SavedCV[]> {
    const { data, error } = await this.supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw new RepositoryError('Failed to fetch CVs', error);
    return data || [];
  }

  async create(cvData: CVData, userId: string): Promise<SavedCV> {
    const { data, error } = await this.supabase
      .from('cvs')
      .insert({
        user_id: userId,
        data: cvData,
        template: cvData.template,
      })
      .select()
      .single();

    if (error) throw new RepositoryError('Failed to create CV', error);
    return data;
  }

  // ... other methods
}
```

**Repository Types**:
- `SupabaseCVRepository` - CV storage (PostgreSQL)
- `SupabaseAuthRepository` - Authentication (Supabase Auth)
- `OpenAIRepository` - AI analysis (OpenAI API)

#### Dependency Injection

Service container for loose coupling:

```typescript
// src/infrastructure/di/container.ts
let cvRepository: ICVRepository | null = null;

export const getCVRepository = (): ICVRepository => {
  if (!cvRepository) {
    cvRepository = new SupabaseCVRepository(supabase);
  }
  return cvRepository;
};

// Usage
const repository = getCVRepository();
const useCase = new CreateCVUseCase(repository);
```

### 4. Presentation Layer

**Location**: `src/presentation/`

**Purpose**: User interface components, pages, and routing.

#### Components

Organized by feature and reusability:

```
presentation/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Suspense.tsx
│   ├── error/            # Error UI
│   │   ├── ErrorBoundary.tsx
│   │   └── ErrorFallback.tsx
│   ├── cv/               # CV-specific components
│   │   ├── CVPreview.tsx
│   │   ├── CVForm.tsx
│   │   └── SectionEditor.tsx
│   └── templates/        # CV templates
│       ├── ModernTemplate.tsx
│       ├── ClassicTemplate.tsx
│       └── MinimalTemplate.tsx
├── pages/                # Route pages
│   ├── Dashboard.tsx
│   ├── Builder.tsx
│   └── Settings.tsx
└── routes/               # Routing configuration
    ├── index.tsx
    └── lazyRoutes.ts
```

#### Error Handling UI

Multi-level error boundaries:

```typescript
// src/presentation/components/error/ErrorBoundary.tsx
export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error caught by boundary:', error, info);
        logError(error, { componentStack: info.componentStack });
      }}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
};
```

## Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract data access behind interfaces

**Benefits**:
- Swap implementations (Supabase → Firebase)
- Easy testing with mocks
- Single responsibility

**Example**:
```typescript
// Domain defines interface
interface ICVRepository {
  getAll(): Promise<CV[]>;
}

// Infrastructure implements
class SupabaseCVRepository implements ICVRepository {
  async getAll() { /* Supabase-specific */ }
}

// Application uses interface
class GetAllCVsUseCase {
  constructor(private repo: ICVRepository) {}
  execute() { return this.repo.getAll(); }
}
```

### 2. Use Case Pattern

**Purpose**: Single responsibility business operations

**Benefits**:
- Clear business logic
- Easy to test
- Reusable across UI

**Example**:
```typescript
export class UpdateCVUseCase {
  constructor(private readonly repository: ICVRepository) {}

  async execute(input: UpdateCVInput): Promise<UpdateCVOutput> {
    // 1. Validation
    const validated = CVDataSchema.parse(input.cvData);

    // 2. Business rules
    const updated = {
      ...validated,
      updatedAt: new Date(),
    };

    // 3. Persistence
    const result = await this.repository.update(input.id, updated);

    return { cv: result };
  }
}
```

### 3. Dependency Injection

**Purpose**: Loose coupling between layers

**Benefits**:
- Easy to test with mocks
- Swap implementations
- Clear dependencies

**Example**:
```typescript
// Container
export const getCreateCVUseCase = () => {
  const repository = getCVRepository();
  return new CreateCVUseCase(repository);
};

// Usage in hook
export const useCreateCV = () => {
  return useMutation({
    mutationFn: async (input) => {
      const useCase = getCreateCVUseCase();
      return useCase.execute(input);
    },
  });
};
```

### 4. Context Splitting

**Purpose**: Avoid context hell and unnecessary re-renders

**Benefits**:
- Performance optimization
- Clear separation of concerns
- Easier testing

**Example**:
```typescript
// Before: Monolithic context
const { cvData, addExperience, currentSection } = useCVContext();

// After: Split contexts
const { cvData } = useCVData();           // Data only
const { addExperience } = useCVActions(); // Actions only
const { currentSection } = useCVUI();     // UI state only
```

## Data Flow

### Creating a CV

```
User Action (Presentation)
    ↓
useCreateCV Hook (Application)
    ↓
CreateCVUseCase (Application)
    ↓
CVDataSchema Validation (Domain)
    ↓
ICVRepository.create() (Domain Interface)
    ↓
SupabaseCVRepository.create() (Infrastructure)
    ↓
Supabase Database
```

### Reading CVs

```
Component Mount (Presentation)
    ↓
useUserCVs Hook (Application)
    ↓
React Query Cache Check
    ↓
ICVRepository.getAll() (Domain Interface)
    ↓
SupabaseCVRepository.getAll() (Infrastructure)
    ↓
Supabase Database
    ↓
Cache Result (5 min staleTime)
```

### AI Analysis

```
User Requests Analysis (Presentation)
    ↓
useAnalyzeCV Hook (Application)
    ↓
AnalyzeCVUseCase (Application)
    ↓
IAIService.analyze() (Domain Interface)
    ↓
OpenAIRepository.analyze() (Infrastructure)
    ↓
OpenAI API
    ↓
Return Analysis Result
```

## Best Practices

### 1. Layer Isolation

**Do**:
```typescript
// Domain entity - no dependencies
export interface Experience {
  id: string;
  company: string;
  position: string;
}
```

**Don't**:
```typescript
// Domain entity with React - WRONG!
import { useState } from 'react';
export interface Experience {
  // ...
}
```

### 2. Use Path Aliases

**Do**:
```typescript
import { CVData } from '@domain/entities';
import { useUserCVs } from '@application/hooks/cv';
import { ErrorBoundary } from '@presentation/components/error';
```

**Don't**:
```typescript
import { CVData } from '../../../domain/entities/CVData';
import { useUserCVs } from '../../application/hooks/cv/useUserCVs';
```

### 3. Single Responsibility

**Do**:
```typescript
// One use case = one operation
class CreateCVUseCase {
  execute(input) { /* create only */ }
}

class UpdateCVUseCase {
  execute(input) { /* update only */ }
}
```

**Don't**:
```typescript
// Multiple responsibilities - WRONG!
class CVUseCase {
  create(input) { /* ... */ }
  update(input) { /* ... */ }
  delete(input) { /* ... */ }
}
```

### 4. Interface Segregation

**Do**:
```typescript
// Small, focused interfaces
interface ICVReader {
  getAll(): Promise<CV[]>;
  getById(id: string): Promise<CV>;
}

interface ICVWriter {
  create(data: CVData): Promise<CV>;
  update(id: string, data: CVData): Promise<CV>;
}
```

**Don't**:
```typescript
// Fat interface - WRONG!
interface IRepository {
  getCVs(): Promise<CV[]>;
  getUsers(): Promise<User[]>;
  createCV(data: CVData): Promise<CV>;
  updateUser(id: string, data: User): Promise<User>;
  // ... 20 more methods
}
```

### 5. Error Handling

**Do**:
```typescript
// Specific error types
throw new ValidationError('Invalid email format');
throw new RepositoryError('Failed to save CV', originalError);
throw new AuthenticationError('Invalid credentials');
```

**Don't**:
```typescript
// Generic errors - WRONG!
throw new Error('Something went wrong');
```

### 6. Testing

**Do**:
```typescript
// Test with mocks
const mockRepo = createMockCVRepository();
const useCase = new CreateCVUseCase(mockRepo);
const result = await useCase.execute(input);
expect(result).toBeDefined();
```

**Don't**:
```typescript
// Test with real database - WRONG for unit tests!
const repo = new SupabaseCVRepository(supabase);
const useCase = new CreateCVUseCase(repo);
```

## Performance Considerations

### 1. Code Splitting

```typescript
// Lazy load routes
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyBuilder = lazy(() => import('@/pages/Builder'));
```

### 2. React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000,    // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 3. Context Optimization

```typescript
// Split contexts to avoid unnecessary re-renders
const { cvData } = useCVData();        // Only re-renders on data change
const { addExp } = useCVActions();     // Stable references
const { section } = useCVUI();         // Only re-renders on UI change
```

### 4. Debouncing

```typescript
// Debounce expensive operations
const debouncedSave = useDebounce(saveFn, 1000);
const debouncedAnalyze = useDebounce(analyzeFn, 2000);
```

## Summary

CV Genius's Clean Architecture provides:

- **Maintainability**: Clear separation of concerns
- **Testability**: Easy to test with mocks
- **Scalability**: Add features without changing core
- **Flexibility**: Swap implementations easily
- **Developer Experience**: Semantic imports and clear patterns

All layers work together following the dependency rule, ensuring a robust and maintainable codebase.
