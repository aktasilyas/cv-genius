# Use Cases

Use Case'ler, application'ın iş akışlarını temsil eder. Her use case, tek bir iş mantığı senaryosunu (Single Responsibility Principle) kapsüller.

## Yapı

```
use-cases/
├── cv/                 # CV işlemleri
│   ├── CreateCVUseCase.ts
│   ├── UpdateCVUseCase.ts
│   ├── DeleteCVUseCase.ts
│   ├── DuplicateCVUseCase.ts
│   ├── GetUserCVsUseCase.ts
│   ├── GetCVByIdUseCase.ts
│   ├── SetDefaultCVUseCase.ts
│   └── ExportCVUseCase.ts
├── auth/               # Authentication işlemleri
│   ├── SignInUseCase.ts
│   ├── SignUpUseCase.ts
│   ├── SignOutUseCase.ts
│   └── GetCurrentUserUseCase.ts
└── ai/                 # AI işlemleri
    ├── AnalyzeCVUseCase.ts
    ├── ParseCVTextUseCase.ts
    ├── MatchJobUseCase.ts
    └── ImproveTextUseCase.ts
```

## Use Case Pattern

Her use case şu yapıyı takip eder:

```typescript
export class MyUseCase {
  constructor(private readonly repository: IRepository) {}

  async execute(input: MyInput): Promise<MyOutput> {
    // 1. Validation
    // 2. Business Logic
    // 3. Repository Interaction
    // 4. Return Result
  }
}
```

## Kullanım

### CV Use Cases

#### CreateCVUseCase

Yeni bir CV oluşturur.

```typescript
import { getCreateCVUseCase } from '@/infrastructure/di/container';
import { createCVData } from '@/domain';

const createCV = getCreateCVUseCase();

try {
  const { cv } = await createCV.execute({
    title: 'Software Engineer CV',
    cvData: createCVData(),
    template: 'modern'
  });

  console.log('CV created:', cv.id);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.fields);
  }
}
```

#### UpdateCVUseCase

Mevcut bir CV'yi günceller.

```typescript
import { getUpdateCVUseCase } from '@/infrastructure/di/container';

const updateCV = getUpdateCVUseCase();

try {
  const { cv } = await updateCV.execute({
    id: 'cv-123',
    title: 'Updated Title',
    cvData: updatedCVData
  });

  toast.success('CV updated successfully');
} catch (error) {
  if (error instanceof NotFoundError) {
    toast.error('CV not found');
  } else if (error instanceof ValidationError) {
    toast.error(error.message);
  }
}
```

#### DeleteCVUseCase

CV'yi siler.

```typescript
import { getDeleteCVUseCase } from '@/infrastructure/di/container';

const deleteCV = getDeleteCVUseCase();

try {
  await deleteCV.execute({ id: 'cv-123' });
  toast.success('CV deleted');
} catch (error) {
  if (error instanceof NotFoundError) {
    toast.error('CV not found');
  }
}
```

#### GetUserCVsUseCase

Kullanıcının tüm CV'lerini getirir.

```typescript
import { getGetUserCVsUseCase } from '@/infrastructure/di/container';

const getUserCVs = getGetUserCVsUseCase();

const { cvs, total } = await getUserCVs.execute();
console.log(`Found ${total} CVs`);
```

#### DuplicateCVUseCase

CV'yi kopyalar.

```typescript
import { getDuplicateCVUseCase } from '@/infrastructure/di/container';

const duplicateCV = getDuplicateCVUseCase();

try {
  const { cv } = await duplicateCV.execute({ id: 'cv-123' });
  toast.success(`Copied: ${cv.title}`);
} catch (error) {
  if (error instanceof NotFoundError) {
    toast.error('CV not found');
  }
}
```

#### ExportCVUseCase

CV'yi export eder (validation ile).

```typescript
import { getExportCVUseCase } from '@/infrastructure/di/container';

const exportCV = getExportCVUseCase();

try {
  const { cv, format } = await exportCV.execute({
    id: 'cv-123',
    format: 'pdf'
  });

  // CV export logic here
  generatePDF(cv);
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error('CV must be complete before exporting');
  }
}
```

### Auth Use Cases

#### SignInUseCase

Kullanıcı girişi.

```typescript
import { getSignInUseCase } from '@/infrastructure/di/container';

const signIn = getSignInUseCase();

try {
  const { session } = await signIn.execute({
    email: 'user@example.com',
    password: 'password123'
  });

  console.log('Logged in:', session.user.email);
  navigate('/dashboard');
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error(error.message);
  }
}
```

#### SignUpUseCase

Yeni kullanıcı kaydı.

```typescript
import { getSignUpUseCase } from '@/infrastructure/di/container';

const signUp = getSignUpUseCase();

try {
  const { session } = await signUp.execute({
    email: 'user@example.com',
    password: 'password123',
    fullName: 'John Doe'
  });

  toast.success('Account created!');
  navigate('/dashboard');
} catch (error) {
  if (error instanceof ConflictError) {
    toast.error('Email already exists');
  } else if (error instanceof ValidationError) {
    toast.error(error.message);
  }
}
```

#### SignOutUseCase

Çıkış yap.

```typescript
import { getSignOutUseCase } from '@/infrastructure/di/container';

const signOut = getSignOutUseCase();

await signOut.execute();
navigate('/login');
```

### AI Use Cases

#### AnalyzeCVUseCase

CV'yi analiz eder ve skor verir.

```typescript
import { getAnalyzeCVUseCase } from '@/infrastructure/di/container';

const analyzeCV = getAnalyzeCVUseCase();

try {
  const { score } = await analyzeCV.execute({
    cvData
  });

  console.log('Overall score:', score.overall);
  console.log('Completeness:', score.breakdown.completeness);
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error('CV needs more content to analyze');
  } else if (error instanceof RateLimitError) {
    toast.error('Too many requests. Please wait.');
  }
}
```

#### ParseCVTextUseCase

Text'ten CV verisi çıkarır.

```typescript
import { getParseCVTextUseCase } from '@/infrastructure/di/container';

const parseCVText = getParseCVTextUseCase();

try {
  const { cvData } = await parseCVText.execute({
    text: linkedInText
  });

  // Extracted data ready to use
  setCVData(cvData);
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error('Text is too short or invalid');
  }
}
```

#### MatchJobUseCase

CV'yi job description ile eşleştirir.

```typescript
import { getMatchJobUseCase } from '@/infrastructure/di/container';

const matchJob = getMatchJobUseCase();

try {
  const { match } = await matchJob.execute({
    cvData,
    jobDescription: jobDescText
  });

  console.log('Match score:', match.score);
  console.log('Matched keywords:', match.matchedKeywords);
  console.log('Missing keywords:', match.missingKeywords);
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error(error.message);
  }
}
```

#### ImproveTextUseCase

Text'i AI ile geliştirir.

```typescript
import { getImproveTextUseCase } from '@/infrastructure/di/container';

const improveText = getImproveTextUseCase();

try {
  const { improvedText } = await improveText.execute({
    text: 'Developed features',
    context: 'achievement'
  });

  console.log('Improved:', improvedText);
} catch (error) {
  if (error instanceof RateLimitError) {
    toast.error('Please wait before trying again');
  }
}
```

## Error Handling

Use case'ler çeşitli error'lar fırlatır:

### Validation Error

```typescript
try {
  await useCase.execute(input);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
    console.error('Fields:', error.fields);
    // Display field-specific errors to user
  }
}
```

### Not Found Error

```typescript
try {
  await useCase.execute({ id: 'invalid-id' });
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Resource not found');
    navigate('/404');
  }
}
```

### Authentication Error

```typescript
try {
  await useCase.execute(input);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Not authenticated');
    navigate('/login');
  }
}
```

### Rate Limit Error

```typescript
try {
  await useCase.execute(input);
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error('Too many requests');
    toast.error('Please wait before trying again');
  }
}
```

## Component Integration

### React Query ile kullanım

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { getGetUserCVsUseCase, getCreateCVUseCase } from '@/infrastructure/di/container';

function MyComponent() {
  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['cvs'],
    queryFn: async () => {
      const getUserCVs = getGetUserCVsUseCase();
      return getUserCVs.execute();
    }
  });

  // Mutation
  const createMutation = useMutation({
    mutationFn: async (input: CreateCVInput) => {
      const createCV = getCreateCVUseCase();
      return createCV.execute(input);
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

  return (
    <button onClick={() => createMutation.mutate({ title, cvData, template })}>
      Create CV
    </button>
  );
}
```

### Custom Hook ile kullanım

```typescript
// hooks/useCVOperations.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getGetUserCVsUseCase,
  getCreateCVUseCase,
  getDeleteCVUseCase
} from '@/infrastructure/di/container';

export const useCVOperations = () => {
  const queryClient = useQueryClient();

  const { data: cvs, isLoading } = useQuery({
    queryKey: ['cvs'],
    queryFn: async () => {
      const getUserCVs = getGetUserCVsUseCase();
      return getUserCVs.execute();
    }
  });

  const createCV = useMutation({
    mutationFn: async (input: CreateCVInput) => {
      const createUseCase = getCreateCVUseCase();
      return createUseCase.execute(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cvs']);
    }
  });

  const deleteCV = useMutation({
    mutationFn: async (id: string) => {
      const deleteUseCase = getDeleteCVUseCase();
      return deleteUseCase.execute({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cvs']);
    }
  });

  return {
    cvs: cvs?.cvs ?? [],
    total: cvs?.total ?? 0,
    isLoading,
    createCV: createCV.mutate,
    deleteCV: deleteCV.mutate
  };
};
```

## Testing Use Cases

```typescript
import { CreateCVUseCase } from '@/application/use-cases/cv/CreateCVUseCase';
import { ValidationError } from '@/application/errors/AppError';

describe('CreateCVUseCase', () => {
  let mockRepository: jest.Mocked<ICVRepository>;
  let useCase: CreateCVUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      // ... other methods
    };
    useCase = new CreateCVUseCase(mockRepository);
  });

  it('should create CV successfully', async () => {
    const input = {
      title: 'Test CV',
      cvData: createCVData(),
      template: 'modern' as CVTemplateType
    };

    mockRepository.create.mockResolvedValue(mockSavedCV);

    const result = await useCase.execute(input);

    expect(result.cv).toBe(mockSavedCV);
    expect(mockRepository.create).toHaveBeenCalledWith(
      'Test CV',
      input.cvData,
      'modern'
    );
  });

  it('should throw ValidationError if title is empty', async () => {
    const input = {
      title: '',
      cvData: createCVData(),
      template: 'modern' as CVTemplateType
    };

    await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
  });
});
```

## Best Practices

1. **Single Responsibility**: Her use case tek bir iş yapar
2. **Validation First**: Input'u her zaman validate et
3. **Meaningful Errors**: Specific error'lar fırlat (ValidationError, NotFoundError, vb.)
4. **Dependency Injection**: Constructor'da repository'leri inject et
5. **Async/Await**: Tüm repository çağrıları async
6. **Type Safety**: Input ve Output interface'leri tanımla
7. **Testing**: Mock repository ile unit test yaz

## Migration from Direct Repository Usage

### Old Way (Direct Repository)

```typescript
const repo = getCVRepository();
const cvs = await repo.getAll();
```

### New Way (Use Case)

```typescript
const getUserCVs = getGetUserCVsUseCase();
const { cvs, total } = await getUserCVs.execute();
```

**Avantajları:**
- Business logic centralized
- Validation included
- Better error handling
- Easier to test
- Clear input/output contracts
