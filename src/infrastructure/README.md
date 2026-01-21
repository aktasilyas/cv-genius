# Infrastructure Layer

Bu klasör, CV Genius'un infrastructure (altyapı) katmanını içerir. Repository implementasyonları ve Dependency Injection container burada bulunur.

## Yapı

```
infrastructure/
├── repositories/           # Repository implementasyonları
│   ├── SupabaseCVRepository.ts
│   ├── SupabaseAuthRepository.ts
│   └── SupabaseSubscriptionRepository.ts
├── di/                     # Dependency Injection
│   └── container.ts        # Service container
└── index.ts                # Barrel export
```

## Repository Pattern

Repository pattern, veri erişim mantığını soyutlar ve test edilebilirliği artırır.

### Avantajlar

1. **Abstraction**: Domain layer, infrastructure detaylarından bağımsız
2. **Testability**: Repository'ler kolayca mock'lanabilir
3. **Maintainability**: Database değişikliği sadece repository'leri etkiler
4. **Separation of Concerns**: İş mantığı ve veri erişimi ayrı

## Repositories

### SupabaseCVRepository

CV verilerinin Supabase'de saklanması ve yönetimi.

```typescript
import { getCVRepository } from '@/infrastructure';

async function saveCVExample() {
  const repo = getCVRepository();

  // Get all CVs
  const cvs = await repo.getAll();

  // Get by ID
  const cv = await repo.getById('cv-id');

  // Create new CV
  const newCV = await repo.create('My CV', cvData, 'modern');

  // Update CV
  const updated = await repo.update('cv-id', {
    title: 'Updated Title',
    cvData: newCVData
  });

  // Delete CV
  await repo.delete('cv-id');

  // Set as default
  await repo.setDefault('cv-id');

  // Duplicate CV
  const duplicate = await repo.duplicate('cv-id');
}
```

**Interface: ICVRepository**
- `getAll()` - Tüm CV'leri getir
- `getById(id)` - ID'ye göre CV getir
- `create(title, cvData, template)` - Yeni CV oluştur
- `update(id, updates)` - CV güncelle
- `delete(id)` - CV sil
- `setDefault(id)` - Default CV olarak ayarla
- `duplicate(id)` - CV'yi kopyala

### SupabaseAuthRepository

Kullanıcı authentication işlemleri.

```typescript
import { getAuthRepository } from '@/infrastructure';

async function authExample() {
  const repo = getAuthRepository();

  // Sign up
  const session = await repo.signUp({
    email: 'user@example.com',
    password: 'password123',
    fullName: 'John Doe'
  });

  // Sign in
  const authSession = await repo.signIn({
    email: 'user@example.com',
    password: 'password123'
  });

  // Get current user
  const user = await repo.getCurrentUser();

  // Sign out
  await repo.signOut();

  // Reset password
  await repo.resetPassword('user@example.com');

  // Update profile
  const updatedUser = await repo.updateProfile({
    fullName: 'Jane Doe'
  });
}
```

**Interface: IAuthRepository**
- `signUp(data)` - Yeni kullanıcı kaydı
- `signIn(credentials)` - Giriş yap
- `signOut()` - Çıkış yap
- `getCurrentUser()` - Mevcut kullanıcıyı getir
- `isAuthenticated()` - Kimlik doğrulama durumunu kontrol et
- `resetPassword(email)` - Şifre sıfırlama
- `updatePassword(newPassword)` - Şifre güncelle
- `updateProfile(updates)` - Profil güncelle

### SupabaseSubscriptionRepository

Abonelik yönetimi.

```typescript
import { getSubscriptionRepository } from '@/infrastructure';

async function subscriptionExample() {
  const repo = getSubscriptionRepository();

  // Get subscription
  const subscription = await repo.getUserSubscription();

  // Check if premium
  const isPremium = await repo.isPremium();

  // Get plan
  const plan = await repo.getUserPlan();

  // Create free subscription
  const newSub = await repo.createFreeSubscription('user-id');

  // Update subscription (from webhook)
  const updated = await repo.updateSubscription('user-id', {
    plan: 'premium',
    status: 'active'
  });

  // Cancel subscription
  await repo.cancelSubscription();
}
```

**Interface: ISubscriptionRepository**
- `getUserSubscription()` - Kullanıcı aboneliğini getir
- `createFreeSubscription(userId)` - Ücretsiz abonelik oluştur
- `isPremium()` - Premium kontrolü
- `getUserPlan()` - Kullanıcı planını getir
- `updateSubscription(userId, updates)` - Abonelik güncelle
- `cancelSubscription()` - Aboneliği iptal et

## Dependency Injection Container

Container, service instance'larını yönetir ve bağımlılıkları çözer.

### Kullanım

```typescript
import {
  getCVRepository,
  getAuthRepository,
  getSubscriptionRepository,
  container
} from '@/infrastructure';

// Convenience getters (recommended)
const cvRepo = getCVRepository();
const authRepo = getAuthRepository();
const subRepo = getSubscriptionRepository();

// Direct access
const cvRepo = container.get<ICVRepository>('ICVRepository');
```

### Testing

Container, test için kolayca mock'lanabilir:

```typescript
import { container } from '@/infrastructure';

describe('MyComponent', () => {
  beforeEach(() => {
    // Register mock repository
    const mockRepo = {
      getAll: jest.fn().mockResolvedValue([]),
      getById: jest.fn().mockResolvedValue(null),
      // ... other methods
    };

    container.register('ICVRepository', mockRepo);
  });

  afterEach(() => {
    container.clear();
  });

  it('should fetch CVs', async () => {
    // Test implementation
  });
});
```

## Data Mapping

Repository'ler database schema'sını domain entity'lere map eder.

### Database → Domain

```typescript
// Database row (snake_case)
{
  id: '123',
  user_id: '456',
  cv_data: {...},
  selected_template: 'modern',
  is_default: true,
  created_at: '2024-01-01',
  updated_at: '2024-01-02'
}

// Domain entity (camelCase)
{
  id: '123',
  userId: '456',
  cvData: {...},
  selectedTemplate: 'modern',
  isDefault: true,
  createdAt: Date,
  updatedAt: Date
}
```

### Validation

Repository'ler, Zod schema'ları kullanarak veriyi validate eder:

```typescript
private mapToEntity(row: any): SavedCV {
  const cvDataResult = CVDataSchema.safeParse(row.cv_data);
  if (!cvDataResult.success) {
    throw new Error(`Invalid CV data: ${cvDataResult.error.message}`);
  }

  return {
    id: row.id,
    cvData: cvDataResult.data, // Validated data
    // ... other fields
  };
}
```

## Migration from Old Services

### Eski Kullanım (cvService)

```typescript
import { cvService } from '@/services/cvService';

const cvs = await cvService.getUserCVs();
const cv = await cvService.getCVById('id');
await cvService.createCV('Title', cvData, 'modern');
```

### Yeni Kullanım (Repository Pattern)

```typescript
import { getCVRepository } from '@/infrastructure';

const repo = getCVRepository();
const cvs = await repo.getAll();
const cv = await repo.getById('id');
await repo.create('Title', cvData, 'modern');
```

### Backward Compatibility

Eski servisler hala çalışır ancak deprecated:

```typescript
// Still works but deprecated
import { cvService } from '@/services/cvService';

// New way (recommended)
import { getCVRepository } from '@/infrastructure';
```

## Error Handling

Repository'ler, hatalar için descriptive error message'lar fırlatır:

```typescript
try {
  const cv = await repo.getById('invalid-id');
} catch (error) {
  console.error(error.message); // "Invalid CV data: ..."
}
```

## Best Practices

1. **Always use the container**: `getCVRepository()` gibi helper'ları kullanın
2. **Don't instantiate directly**: `new SupabaseCVRepository()` kullanmayın
3. **Interface-based programming**: `ICVRepository` type'ını kullanın
4. **Error handling**: Try-catch bloklarıyla hataları yakalayın
5. **Testing**: Mock repository'ler oluşturun
6. **Validation**: Domain entity'leri döndürmeden önce validate edin

## Architecture

```
Component
    ↓
Context/Hook
    ↓
Container (DI)
    ↓
Repository (Infrastructure)
    ↓
Database (Supabase)
```

## Resources

- [Domain Layer](../domain/README.md)
- [Application Layer](../application/README.md)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
