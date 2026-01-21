# CV Genius Architecture

Bu dokümantasyon, CV Genius projesinin mimari yapısını açıklar.

## Mimari Genel Bakış

CV Genius, **Domain-Driven Design (DDD)** ve **Clean Architecture** prensiplerine göre yapılandırılmıştır.

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (React Components, Pages)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Application Layer                      │
│         (Contexts, Hooks, Use Cases)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                     Domain Layer                         │
│    (Entities, Value Objects, Interfaces)                 │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 Infrastructure Layer                     │
│        (Repositories, External Services)                 │
└─────────────────────────────────────────────────────────┘
```

## Katman Yapısı

### 1. Domain Layer (`src/domain/`)

**Amaç:** İş mantığı ve kurallarının tanımlandığı, framework'ten bağımsız katman.

**İçerik:**
- **Entities**: İş nesneleri (CVData, Experience, Education, vb.)
- **Value Objects**: Değişmez değer objeleri (SkillLevel, LanguageProficiency, vb.)
- **Interfaces**: Repository ve servis arayüzleri

**Özellikler:**
- Framework'ten bağımsız
- Zod ile runtime validation
- Factory function'lar ile güvenli entity oluşturma
- Type-safe ve immutable

**Örnek:**
```typescript
import { createExperience, ExperienceSchema } from '@/domain';

const experience = createExperience({
  company: 'Tech Corp',
  position: 'Developer'
});

// Validation
const result = ExperienceSchema.safeParse(data);
```

### 2. Application Layer (`src/application/`)

**Amaç:** Use case'leri ve application state'ini yönetir.

**İçerik:**
- **Contexts**: State management (CVData, Actions, UI, AI, Version)
- **Hooks**: Custom hooks ve facade pattern (useCV)
- **Providers**: Context provider wrapper'ları

**Özellikler:**
- Separation of concerns (her context tek sorumluluk)
- Performance optimization (memoization, selective subscription)
- Facade pattern ile basit API

**Örnek:**
```typescript
import { useCV } from '@/application';

function MyComponent() {
  const { cvData, addExperience, currentStep } = useCV();
  // All contexts combined
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)

**Amaç:** External service'ler ve data persistence implementasyonları.

**İçerik:**
- **Repositories**: Database access implementasyonları
- **DI Container**: Dependency injection container

**Özellikler:**
- Repository pattern
- Dependency injection
- Data mapping (DB ↔ Domain)
- Error handling

**Örnek:**
```typescript
import { getCVRepository } from '@/infrastructure';

const repo = getCVRepository();
const cvs = await repo.getAll();
```

### 4. Presentation Layer (`src/pages/`, `src/components/`)

**Amaç:** UI components ve sayfalar.

**İçerik:**
- Pages (Index, Builder, Dashboard, vb.)
- Components (UI elements)
- Templates (CV templates)

**Özellikler:**
- React components
- Tailwind CSS styling
- Shadcn/ui components

## Veri Akışı

### 1. Read Flow (Veri Okuma)

```
Component
    ↓ (useCV hook)
Context (Application)
    ↓ (state)
LocalStorage / Repository
    ↓
Database (Supabase)
```

### 2. Write Flow (Veri Yazma)

```
Component
    ↓ (action call)
Context (Application)
    ↓ (update state)
LocalStorage
    ↓ (persist)
Repository (Infrastructure)
    ↓
Database (Supabase)
```

### 3. Authentication Flow

```
Login Page
    ↓
AuthRepository
    ↓
Supabase Auth
    ↓
Session Token
    ↓
Protected Routes
```

## Dependency Direction

Bağımlılıklar her zaman içe doğru (domain'e doğru) akar:

```
Infrastructure → Domain ← Application → Presentation
```

- **Presentation** depends on Application & Domain
- **Application** depends on Domain
- **Infrastructure** depends on Domain
- **Domain** depends on nothing (pure business logic)

## Key Patterns

### 1. Repository Pattern

Database erişimini soyutlar:

```typescript
interface ICVRepository {
  getAll(): Promise<SavedCV[]>;
  getById(id: string): Promise<SavedCV | null>;
  create(...): Promise<SavedCV>;
  update(...): Promise<SavedCV>;
  delete(id: string): Promise<void>;
}
```

### 2. Dependency Injection

Service'leri container üzerinden yönetir:

```typescript
const container = Container.getInstance();
const repo = container.get<ICVRepository>('ICVRepository');
```

### 3. Factory Pattern

Safe entity creation:

```typescript
const experience = createExperience({
  company: 'Tech Corp',
  // ID auto-generated
  // Default values filled
});
```

### 4. Facade Pattern

Simplified API:

```typescript
// Instead of multiple hooks
const { cvData } = useCVData();
const { addExperience } = useCVActions();

// Use single facade
const { cvData, addExperience } = useCV();
```

### 5. Context Separation

Concerns separated into focused contexts:

- **CVDataContext**: Pure data state
- **CVActionsContext**: CRUD operations
- **CVUIContext**: UI state
- **AIContext**: AI features
- **VersionContext**: Version history

## State Management

### Local State (React Context)

```typescript
CVDataContext → localStorage → Auto-sync
```

### Server State (React Query)

```typescript
useQuery → Supabase → Cache → Auto-refetch
```

### UI State

```typescript
CVUIContext → Session-based → Not persisted
```

## Data Validation

### 1. Runtime Validation (Zod)

```typescript
const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experience: z.array(ExperienceSchema),
  // ...
});

const result = CVDataSchema.safeParse(data);
```

### 2. Type Safety (TypeScript)

```typescript
type CVData = z.infer<typeof CVDataSchema>;
```

### 3. Repository Validation

```typescript
private mapToEntity(row: any): SavedCV {
  const result = CVDataSchema.safeParse(row.cv_data);
  if (!result.success) throw new Error(...);
  return result.data;
}
```

## Error Handling

### 1. Repository Layer

```typescript
try {
  await repo.create(...);
} catch (error) {
  throw new Error(`Failed to create CV: ${error.message}`);
}
```

### 2. Application Layer

```typescript
const { mutate, error, isError } = useMutation({
  onError: (error) => {
    toast.error(error.message);
  }
});
```

### 3. Presentation Layer

```typescript
{isError && <ErrorMessage error={error} />}
```

## Testing Strategy

### 1. Domain Layer (Unit Tests)

```typescript
describe('createExperience', () => {
  it('should create experience with default values', () => {
    const exp = createExperience({});
    expect(exp.id).toBeDefined();
    expect(exp.achievements).toEqual([]);
  });
});
```

### 2. Application Layer (Integration Tests)

```typescript
describe('useCVActions', () => {
  it('should add experience', () => {
    const { result } = renderHook(() => useCV(), {
      wrapper: AppProviders
    });

    act(() => result.current.addExperience());
    expect(result.current.cvData.experience).toHaveLength(1);
  });
});
```

### 3. Infrastructure Layer (Mock Tests)

```typescript
describe('SupabaseCVRepository', () => {
  it('should fetch all CVs', async () => {
    const mockSupabase = { from: jest.fn() };
    const repo = new SupabaseCVRepository(mockSupabase);

    await repo.getAll();
    expect(mockSupabase.from).toHaveBeenCalledWith('cvs');
  });
});
```

## Performance Optimization

### 1. Memoization

```typescript
const value = useMemo(() => ({
  cvData,
  setCVData
}), [cvData]);
```

### 2. Callback Optimization

```typescript
const addExperience = useCallback(() => {
  setCVData(prev => ({
    ...prev,
    experience: [...prev.experience, createExperience({})]
  }));
}, [setCVData]);
```

### 3. Context Splitting

```typescript
// Only subscribe to what you need
const { cvData } = useCVData();  // Only re-renders on data change
const { addExperience } = useCVActions();  // Stable reference
```

### 4. Local Storage Debouncing

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('cv-data', JSON.stringify(cvData));
  }, 500);
  return () => clearTimeout(timer);
}, [cvData]);
```

## Security Considerations

### 1. Row Level Security (RLS)

```sql
CREATE POLICY "Users can only access their own CVs"
ON cvs FOR ALL
USING (auth.uid() = user_id);
```

### 2. Input Validation

```typescript
// Zod schema validation before database insert
const validated = CVDataSchema.parse(input);
```

### 3. Authentication Check

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('Unauthorized');
```

## Deployment Architecture

```
Vercel (Frontend)
    ↓
Supabase (Backend)
    ├── Database (PostgreSQL)
    ├── Auth
    ├── Storage
    └── Edge Functions
```

## Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
```

## Migration Path

Projede yapılan refactoring'ler backward compatible:

### Old → New

```typescript
// OLD
import { useCVContext } from '@/context/CVContext';
import { cvService } from '@/services/cvService';

// NEW (recommended)
import { useCV } from '@/application';
import { getCVRepository } from '@/infrastructure';
```

Eski API'ler deprecated olarak işaretlenmiş ancak hala çalışıyor.

## Best Practices

1. **Always use interfaces**: Domain interfaces kullan, concrete types değil
2. **Factory functions**: Entity'leri factory function'larla oluştur
3. **Validation**: Zod schema'ları ile validate et
4. **Error handling**: Try-catch ve meaningful error messages
5. **Immutability**: State'i direkt mutate etme
6. **Single Responsibility**: Her class/function tek bir iş yapsın
7. **Dependency Injection**: Container kullan, direct instantiation yapma

## Resources

- [Domain Layer](src/domain/README.md)
- [Application Layer](src/application/README.md)
- [Infrastructure Layer](src/infrastructure/README.md)
- [Migration Guide](MIGRATION_GUIDE.md)

## Future Improvements

1. **Command/Query Separation (CQRS)**: Read/write operations'ı ayır
2. **Event Sourcing**: State changes'i event'ler olarak kaydet
3. **Domain Events**: Entity changes'de event publish et
4. **Aggregate Boundaries**: Daha iyi transaction boundaries
5. **Cache Layer**: Redis ile caching ekle
6. **API Gateway**: Backend for Frontend pattern
