# CV Genius API Reference

This document provides a comprehensive reference for hooks, contexts, use cases, and repositories in CV Genius.

## Table of Contents

1. [React Query Hooks](#react-query-hooks)
2. [Contexts](#contexts)
3. [Use Cases](#use-cases)
4. [Repositories](#repositories)
5. [Error Types](#error-types)
6. [Performance Hooks](#performance-hooks)

## React Query Hooks

### CV Hooks

Located in `src/application/hooks/cv/`

#### useUserCVs

Fetches all CVs for the current user.

```typescript
import { useUserCVs } from '@application/hooks/cv';

const Component = () => {
  const { data: cvs, isLoading, error } = useUserCVs();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return <CVList cvs={cvs} />;
};
```

**Returns**:
- `data: SavedCV[]` - Array of user's CVs
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error if any
- `refetch: () => void` - Manual refetch function

**Configuration**:
- `staleTime`: 5 minutes
- `enabled`: Only when user is authenticated

---

#### useCreateCV

Creates a new CV.

```typescript
import { useCreateCV } from '@application/hooks/cv';

const Component = () => {
  const createCV = useCreateCV();

  const handleCreate = async () => {
    try {
      const result = await createCV.mutateAsync({
        cvData: { /* ... */ },
        userId: 'user-123',
      });
      console.log('Created:', result.cv);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <button onClick={handleCreate} disabled={createCV.isPending}>
      {createCV.isPending ? 'Creating...' : 'Create CV'}
    </button>
  );
};
```

**Parameters**:
```typescript
interface CreateCVInput {
  cvData: CVData;
  userId: string;
}
```

**Returns**:
```typescript
interface CreateCVOutput {
  cv: SavedCV;
}
```

**States**:
- `isPending: boolean` - Mutation in progress
- `isError: boolean` - Mutation failed
- `error: Error | null` - Error details

---

#### useUpdateCV

Updates an existing CV.

```typescript
import { useUpdateCV } from '@application/hooks/cv';

const Component = () => {
  const updateCV = useUpdateCV();

  const handleUpdate = async () => {
    await updateCV.mutateAsync({
      id: 'cv-123',
      cvData: { /* updated data */ },
    });
  };

  return <button onClick={handleUpdate}>Update</button>;
};
```

**Parameters**:
```typescript
interface UpdateCVInput {
  id: string;
  cvData: CVData;
}
```

**Invalidates**: `['cvs']` query key

---

#### useDeleteCV

Deletes a CV.

```typescript
import { useDeleteCV } from '@application/hooks/cv';

const Component = ({ cvId }: { cvId: string }) => {
  const deleteCV = useDeleteCV();

  const handleDelete = () => {
    if (confirm('Delete this CV?')) {
      deleteCV.mutate(cvId);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};
```

**Parameters**: `cvId: string`

**Invalidates**: `['cvs']` query key

---

#### useDuplicateCV

Duplicates an existing CV.

```typescript
import { useDuplicateCV } from '@application/hooks/cv';

const Component = ({ cvId }: { cvId: string }) => {
  const duplicateCV = useDuplicateCV();

  return (
    <button onClick={() => duplicateCV.mutate(cvId)}>
      Duplicate
    </button>
  );
};
```

**Parameters**: `cvId: string`

**Returns**: `SavedCV` (duplicated CV)

---

### AI Hooks

Located in `src/application/hooks/ai/`

#### useAnalyzeCV

Analyzes a CV using AI.

```typescript
import { useAnalyzeCV } from '@application/hooks/ai';

const Component = () => {
  const analyzeCV = useAnalyzeCV();

  const handleAnalyze = async () => {
    const result = await analyzeCV.mutateAsync({
      cvData: { /* ... */ },
      language: 'en',
    });
    console.log('Score:', result.score);
    console.log('Suggestions:', result.suggestions);
  };

  return <button onClick={handleAnalyze}>Analyze CV</button>;
};
```

**Parameters**:
```typescript
interface AnalyzeCVInput {
  cvData: CVData;
  language?: 'en' | 'tr';
}
```

**Returns**:
```typescript
interface AnalysisResult {
  score: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  atsOptimization: {
    score: number;
    tips: string[];
  };
}
```

---

## Contexts

### CV Contexts

Located in `src/application/context/`

#### useCVData

Access CV data state.

```typescript
import { useCVData } from '@application/context';

const Component = () => {
  const { cvData, setCvData } = useCVData();

  return (
    <div>
      <h1>{cvData.personalInfo.fullName}</h1>
    </div>
  );
};
```

**Returns**:
```typescript
interface CVDataContextType {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}
```

---

#### useCVActions

Access CV manipulation actions.

```typescript
import { useCVActions } from '@application/context';

const Component = () => {
  const {
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    addSkill,
    addLanguage,
    addCertificate,
  } = useCVActions();

  const handleAdd = () => {
    addExperience({
      id: crypto.randomUUID(),
      company: 'Tech Corp',
      position: 'Developer',
      startDate: new Date(),
    });
  };

  return <button onClick={handleAdd}>Add Experience</button>;
};
```

**Available Actions**:
```typescript
interface CVActionsContextType {
  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (startIndex: number, endIndex: number) => void;

  // Education
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  // Skills
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  // Languages
  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;

  // Certificates
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // Template
  changeTemplate: (template: CVTemplate) => void;
  updateCustomization: (custom: Partial<TemplateCustomization>) => void;
}
```

---

#### useCVUI

Access UI state.

```typescript
import { useCVUI } from '@application/context';

const Component = () => {
  const {
    currentSection,
    setCurrentSection,
    activeElement,
    setActiveElement,
    isSidebarOpen,
    toggleSidebar,
  } = useCVUI();

  return (
    <nav>
      <button onClick={() => setCurrentSection('experience')}>
        Experience
      </button>
      <button onClick={() => setCurrentSection('education')}>
        Education
      </button>
    </nav>
  );
};
```

**Returns**:
```typescript
interface CVUIContextType {
  currentSection: CVSection;
  setCurrentSection: (section: CVSection) => void;
  activeElement: string | null;
  setActiveElement: (id: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

type CVSection =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certificates';
```

---

#### useAI

Access AI analysis state.

```typescript
import { useAI } from '@application/context';

const Component = () => {
  const {
    analysisResult,
    isAnalyzing,
    analyzeCV,
    clearAnalysis,
  } = useAI();

  if (isAnalyzing) return <Spinner />;

  return (
    <div>
      {analysisResult && (
        <div>
          <p>Score: {analysisResult.score}</p>
          <ul>
            {analysisResult.suggestions.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

**Returns**:
```typescript
interface AIContextType {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  analyzeCV: (cvData: CVData) => Promise<void>;
  clearAnalysis: () => void;
}
```

---

#### useVersion

Access version history.

```typescript
import { useVersion } from '@application/context';

const Component = () => {
  const {
    versions,
    currentVersion,
    saveVersion,
    restoreVersion,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useVersion();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
};
```

**Returns**:
```typescript
interface VersionContextType {
  versions: CVVersion[];
  currentVersion: number;
  saveVersion: (description: string) => void;
  restoreVersion: (version: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}
```

---

## Use Cases

### CV Use Cases

Located in `src/application/use-cases/cv/`

#### CreateCVUseCase

```typescript
import { CreateCVUseCase } from '@application/use-cases/cv';
import { getCVRepository } from '@infrastructure/di/container';

const useCase = new CreateCVUseCase(getCVRepository());

const result = await useCase.execute({
  cvData: {
    personalInfo: { /* ... */ },
    experiences: [],
    // ...
  },
  userId: 'user-123',
});
```

#### UpdateCVUseCase

```typescript
import { UpdateCVUseCase } from '@application/use-cases/cv';

const useCase = new UpdateCVUseCase(getCVRepository());

await useCase.execute({
  id: 'cv-123',
  cvData: { /* updated data */ },
});
```

#### DeleteCVUseCase

```typescript
import { DeleteCVUseCase } from '@application/use-cases/cv';

const useCase = new DeleteCVUseCase(getCVRepository());

await useCase.execute('cv-123');
```

---

### AI Use Cases

Located in `src/application/use-cases/ai/`

#### AnalyzeCVUseCase

```typescript
import { AnalyzeCVUseCase } from '@application/use-cases/ai';
import { getAIService } from '@infrastructure/di/container';

const useCase = new AnalyzeCVUseCase(getAIService());

const analysis = await useCase.execute({
  cvData: { /* ... */ },
  language: 'en',
});

console.log('Score:', analysis.score);
console.log('Suggestions:', analysis.suggestions);
```

---

## Repositories

### ICVRepository

Located in `src/domain/interfaces/ICVRepository.ts`

```typescript
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

**Implementation**: `SupabaseCVRepository` in `src/infrastructure/repositories/`

---

### IAIService

Located in `src/domain/interfaces/IAIService.ts`

```typescript
export interface IAIService {
  analyzeCV(cvData: CVData, language: string): Promise<AnalysisResult>;
  parseText(text: string): Promise<ParsedCVData>;
  generateContent(prompt: string): Promise<string>;
}
```

**Implementation**: `OpenAIRepository` in `src/infrastructure/repositories/`

---

### IAuthRepository

Located in `src/domain/interfaces/IAuthRepository.ts`

```typescript
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<User>;
  signUp(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
}
```

**Implementation**: `SupabaseAuthRepository` in `src/infrastructure/repositories/`

---

## Error Types

Located in `src/application/errors/`

### AppError

Base error class.

```typescript
import { AppError } from '@application/errors';

throw new AppError('GENERIC_ERROR', 'Something went wrong');
```

### ValidationError

For validation failures.

```typescript
import { ValidationError } from '@application/errors';

throw new ValidationError('Invalid email format');
```

### RepositoryError

For database/storage errors.

```typescript
import { RepositoryError } from '@application/errors';

throw new RepositoryError('Failed to save CV', originalError);
```

### AuthenticationError

For authentication failures.

```typescript
import { AuthenticationError } from '@application/errors';

throw new AuthenticationError('Invalid credentials');
```

### AuthorizationError

For authorization failures.

```typescript
import { AuthorizationError } from '@application/errors';

throw new AuthorizationError('Insufficient permissions');
```

---

## Performance Hooks

Located in `src/application/hooks/performance/`

### useDebounce

Debounce a value.

```typescript
import { useDebounce } from '@application/hooks/performance';

const Component = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // Only runs after 500ms of no changes
    console.log('Searching:', debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
};
```

**Parameters**:
- `value: T` - Value to debounce
- `delay: number` - Delay in milliseconds

**Returns**: `T` - Debounced value

---

### useThrottle

Throttle a value.

```typescript
import { useThrottle } from '@application/hooks/performance';

const Component = () => {
  const [position, setPosition] = useState(0);
  const throttledPosition = useThrottle(position, 100);

  // Only updates every 100ms max
  useEffect(() => {
    console.log('Position:', throttledPosition);
  }, [throttledPosition]);

  return <div onScroll={(e) => setPosition(e.currentTarget.scrollTop)} />;
};
```

**Parameters**:
- `value: T` - Value to throttle
- `interval: number` - Minimum interval in milliseconds

**Returns**: `T` - Throttled value

---

### useMemoizedValue

Memoize expensive computations.

```typescript
import { useMemoizedValue } from '@application/hooks/performance';

const Component = ({ data }) => {
  const processedData = useMemoizedValue(
    () => expensiveProcessing(data),
    [data]
  );

  return <div>{processedData}</div>;
};
```

**Parameters**:
- `factory: () => T` - Factory function
- `deps: DependencyList` - Dependencies

**Returns**: `T` - Memoized value

---

## Query Keys

Located in `src/application/hooks/queries/queryKeys.ts`

```typescript
import { queryKeys } from '@application/hooks/queries/queryKeys';

// Usage in queries
useQuery({
  queryKey: queryKeys.cv.list(userId),
  // ...
});

useQuery({
  queryKey: queryKeys.cv.detail(cvId),
  // ...
});
```

**Available Keys**:
```typescript
export const queryKeys = {
  cv: {
    all: ['cvs'] as const,
    lists: () => [...queryKeys.cv.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.cv.lists(), userId] as const,
    details: () => [...queryKeys.cv.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.cv.details(), id] as const,
  },
  ai: {
    all: ['ai'] as const,
    analysis: (cvId: string) => [...queryKeys.ai.all, 'analysis', cvId] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
};
```

---

## Type Reference

### CVData

```typescript
interface CVData {
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

### SavedCV

```typescript
interface SavedCV {
  id: string;
  userId: string;
  data: CVData;
  template: CVTemplate;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Experience

```typescript
interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements?: string[];
}
```

### Education

```typescript
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  gpa?: string;
  description?: string;
}
```

### Skill

```typescript
interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category?: string;
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
```

---

For more information, see:
- [Architecture Guide](./ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Main README](../README.md)
