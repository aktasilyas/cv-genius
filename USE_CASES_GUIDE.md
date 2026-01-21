# Use Cases Guide

Bu guide, CV Genius'ta Use Case Pattern'in nasıl kullanıldığını açıklar.

## Use Case Pattern Nedir?

Use Case Pattern, application'ın iş akışlarını encapsulate eder. Her use case:
- ✅ Tek bir iş senaryosunu temsil eder (Single Responsibility)
- ✅ Input validation içerir
- ✅ Business logic'i kapsüller
- ✅ Repository'leri kullanır
- ✅ Meaningful error'lar fırlatır
- ✅ Test edilebilir

## Neden Use Case Pattern?

### Öncesi (Direct Repository)

```typescript
// Component içinde
const repo = getCVRepository();

// Validation yok
const cv = await repo.create(title, cvData, template);

// Error handling component'te
try {
  // ...
} catch (error) {
  toast.error('Something went wrong');
}
```

**Sorunlar:**
- Business logic component'te dağınık
- Validation yok veya component'te
- Error handling tutarsız
- Test etmek zor
- Kod tekrarı

### Sonrası (Use Case)

```typescript
// Component içinde
const createCV = getCreateCVUseCase();

const { cv } = await createCV.execute({
  title,
  cvData,
  template
});

// Validation use case içinde
// Business logic centralized
// Consistent error handling
```

**Avantajlar:**
- ✅ Business logic centralized
- ✅ Validation included
- ✅ Consistent error handling
- ✅ Easier to test
- ✅ Reusable across UI

## Kullanılabilir Use Case'ler

### CV Operations

| Use Case | Açıklama |
|----------|----------|
| `CreateCVUseCase` | Yeni CV oluştur (validation ile) |
| `UpdateCVUseCase` | CV güncelle |
| `DeleteCVUseCase` | CV sil (existence check ile) |
| `DuplicateCVUseCase` | CV kopyala |
| `GetUserCVsUseCase` | Tüm CV'leri getir (sorted) |
| `GetCVByIdUseCase` | ID ile CV getir |
| `SetDefaultCVUseCase` | Default CV ayarla |
| `ExportCVUseCase` | CV export et (completeness check ile) |

### Authentication

| Use Case | Açıklama |
|----------|----------|
| `SignInUseCase` | Email/password ile giriş |
| `SignUpUseCase` | Yeni hesap oluştur |
| `SignOutUseCase` | Çıkış yap |
| `GetCurrentUserUseCase` | Mevcut kullanıcıyı getir |

### AI Operations

| Use Case | Açıklama |
|----------|----------|
| `AnalyzeCVUseCase` | CV'yi analiz et ve skor ver |
| `ParseCVTextUseCase` | Text'ten CV verisi çıkar |
| `MatchJobUseCase` | Job description ile eşleştir |
| `ImproveTextUseCase` | Text'i AI ile geliştir |

## Pratik Örnekler

### Örnek 1: CV Oluşturma

```typescript
import { getCreateCVUseCase } from '@/infrastructure';
import { ValidationError } from '@/application';

function CreateCVButton() {
  const createCV = getCreateCVUseCase();

  const handleCreate = async () => {
    try {
      const { cv } = await createCV.execute({
        title: 'My Professional CV',
        cvData: myData,
        template: 'modern'
      });

      toast.success(`CV created: ${cv.id}`);
      navigate(`/cv/${cv.id}`);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Show field-specific errors
        Object.entries(error.fields || {}).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error('Failed to create CV');
      }
    }
  };

  return <button onClick={handleCreate}>Create CV</button>;
}
```

### Örnek 2: CV Listesi

```typescript
import { getGetUserCVsUseCase } from '@/infrastructure';
import { useQuery } from '@tanstack/react-query';

function CVList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cvs'],
    queryFn: async () => {
      const getUserCVs = getGetUserCVsUseCase();
      return getUserCVs.execute();
    }
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div>
      <h2>Your CVs ({data.total})</h2>
      {data.cvs.map(cv => (
        <CVCard key={cv.id} cv={cv} />
      ))}
    </div>
  );
}
```

### Örnek 3: CV Silme

```typescript
import { getDeleteCVUseCase } from '@/infrastructure';
import { NotFoundError } from '@/application';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function DeleteCVButton({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const deleteCV = getDeleteCVUseCase();
      await deleteCV.execute({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cvs']);
      toast.success('CV deleted');
    },
    onError: (error) => {
      if (error instanceof NotFoundError) {
        toast.error('CV not found');
      } else {
        toast.error('Failed to delete CV');
      }
    }
  });

  return (
    <button
      onClick={() => deleteMutation.mutate()}
      disabled={deleteMutation.isPending}
    >
      Delete
    </button>
  );
}
```

### Örnek 4: AI Analysis

```typescript
import { getAnalyzeCVUseCase } from '@/infrastructure';
import { RateLimitError, ValidationError } from '@/application';

function AnalyzeButton({ cvData }: { cvData: CVData }) {
  const [score, setScore] = useState<CVScore | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);

    try {
      const analyzeCV = getAnalyzeCVUseCase();
      const { score } = await analyzeCV.execute({ cvData });

      setScore(score);
      toast.success('Analysis complete!');
    } catch (error) {
      if (error instanceof ValidationError) {
        toast.error('CV needs more content to analyze');
      } else if (error instanceof RateLimitError) {
        toast.error('Too many requests. Please wait.');
      } else {
        toast.error('Analysis failed');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={analyzing}>
        {analyzing ? 'Analyzing...' : 'Analyze CV'}
      </button>

      {score && (
        <div>
          <h3>Overall Score: {score.overall}/100</h3>
          <ul>
            <li>Completeness: {score.breakdown.completeness}</li>
            <li>Quality: {score.breakdown.quality}</li>
            <li>ATS Compatibility: {score.breakdown.atsCompatibility}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Örnek 5: Custom Hook with Use Cases

```typescript
// hooks/useCVOperations.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGetUserCVsUseCase,
  getCreateCVUseCase,
  getUpdateCVUseCase,
  getDeleteCVUseCase
} from '@/infrastructure';
import type { CreateCVInput, UpdateCVInput } from '@/application';

export const useCVOperations = () => {
  const queryClient = useQueryClient();

  // Query: Get all CVs
  const { data, isLoading, error } = useQuery({
    queryKey: ['cvs'],
    queryFn: async () => {
      const getUserCVs = getGetUserCVsUseCase();
      return getUserCVs.execute();
    }
  });

  // Mutation: Create CV
  const createCV = useMutation({
    mutationFn: async (input: CreateCVInput) => {
      const createUseCase = getCreateCVUseCase();
      return createUseCase.execute(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cvs']);
      toast.success('CV created');
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create CV');
      }
    }
  });

  // Mutation: Update CV
  const updateCV = useMutation({
    mutationFn: async (input: UpdateCVInput) => {
      const updateUseCase = getUpdateCVUseCase();
      return updateUseCase.execute(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cvs']);
      toast.success('CV updated');
    }
  });

  // Mutation: Delete CV
  const deleteCV = useMutation({
    mutationFn: async (id: string) => {
      const deleteUseCase = getDeleteCVUseCase();
      return deleteUseCase.execute({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cvs']);
      toast.success('CV deleted');
    }
  });

  return {
    cvs: data?.cvs ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createCV: createCV.mutate,
    updateCV: updateCV.mutate,
    deleteCV: deleteCV.mutate,
    isCreating: createCV.isPending,
    isUpdating: updateCV.isPending,
    isDeleting: deleteCV.isPending
  };
};

// Component'te kullanım
function MyComponent() {
  const { cvs, total, createCV, deleteCV, isLoading } = useCVOperations();

  if (isLoading) return <Loading />;

  return (
    <div>
      <h2>Your CVs ({total})</h2>
      <button onClick={() => createCV({ title, cvData, template })}>
        Create New CV
      </button>
      {cvs.map(cv => (
        <div key={cv.id}>
          <h3>{cv.title}</h3>
          <button onClick={() => deleteCV(cv.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling Strategy

### 1. ValidationError

**Ne zaman:** Input validation başarısız
**Nasıl handle edilir:** Field-specific error göster

```typescript
catch (error) {
  if (error instanceof ValidationError) {
    // Show each field error
    error.fields?.forEach((field, message) => {
      showFieldError(field, message);
    });
  }
}
```

### 2. NotFoundError

**Ne zaman:** Resource bulunamadı
**Nasıl handle edilir:** 404 page'e yönlendir

```typescript
catch (error) {
  if (error instanceof NotFoundError) {
    navigate('/404');
  }
}
```

### 3. AuthenticationError

**Ne zaman:** User authenticated değil
**Nasıl handle edilir:** Login page'e yönlendir

```typescript
catch (error) {
  if (error instanceof AuthenticationError) {
    navigate('/login');
  }
}
```

### 4. RateLimitError

**Ne zaman:** Too many requests
**Nasıl handle edilir:** Wait mesajı göster

```typescript
catch (error) {
  if (error instanceof RateLimitError) {
    toast.error('Please wait before trying again');
    setRetryAfter(60); // seconds
  }
}
```

### 5. ConflictError

**Ne zaman:** Resource already exists
**Nasıl handle edilir:** Conflict mesajı göster

```typescript
catch (error) {
  if (error instanceof ConflictError) {
    toast.error('Email already exists');
  }
}
```

## Testing Use Cases

```typescript
import { CreateCVUseCase } from '@/application/use-cases/cv/CreateCVUseCase';
import { ValidationError, NotFoundError } from '@/application/errors/AppError';

describe('CreateCVUseCase', () => {
  let mockRepo: jest.Mocked<ICVRepository>;
  let useCase: CreateCVUseCase;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      getAll: jest.fn(),
      // ... other methods
    };
    useCase = new CreateCVUseCase(mockRepo);
  });

  it('should create CV successfully', async () => {
    const input = {
      title: 'Test CV',
      cvData: mockCVData,
      template: 'modern' as CVTemplateType
    };

    mockRepo.create.mockResolvedValue(mockSavedCV);

    const result = await useCase.execute(input);

    expect(result.cv).toBe(mockSavedCV);
    expect(mockRepo.create).toHaveBeenCalledWith(
      'Test CV',
      input.cvData,
      'modern'
    );
  });

  it('should throw ValidationError for empty title', async () => {
    const input = {
      title: '',
      cvData: mockCVData,
      template: 'modern' as CVTemplateType
    };

    await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
  });

  it('should validate CV data with Zod', async () => {
    const input = {
      title: 'Test',
      cvData: invalidCVData, // Invalid data
      template: 'modern' as CVTemplateType
    };

    await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
  });
});
```

## Best Practices

### 1. Always Use Use Cases in Components

```typescript
// ❌ BAD: Direct repository usage
const repo = getCVRepository();
const cvs = await repo.getAll();

// ✅ GOOD: Use case
const getUserCVs = getGetUserCVsUseCase();
const { cvs } = await getUserCVs.execute();
```

### 2. Handle All Error Types

```typescript
try {
  await useCase.execute(input);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof NotFoundError) {
    // Handle not found
  } else if (error instanceof AuthenticationError) {
    // Handle auth errors
  } else {
    // Handle unexpected errors
  }
}
```

### 3. Use React Query for Server State

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['cvs'],
  queryFn: async () => {
    const getUserCVs = getGetUserCVsUseCase();
    return getUserCVs.execute();
  }
});
```

### 4. Create Custom Hooks

```typescript
// Encapsulate use case logic in custom hooks
const useCVOperations = () => {
  // Use cases + React Query
  return { cvs, createCV, deleteCV, ... };
};
```

### 5. Test Use Cases Independently

```typescript
// Test use case without UI
describe('CreateCVUseCase', () => {
  it('should validate input', async () => {
    // Test validation logic
  });
});
```

## Migration Checklist

- [ ] Identify direct repository usage in components
- [ ] Replace with appropriate use case
- [ ] Update error handling
- [ ] Add proper TypeScript types
- [ ] Write tests for use cases
- [ ] Create custom hooks if needed
- [ ] Update documentation

## Resources

- [Use Cases README](src/application/use-cases/README.md)
- [Application Layer](src/application/README.md)
- [Infrastructure Layer](src/infrastructure/README.md)
- [Error Handling](src/application/errors/AppError.ts)
