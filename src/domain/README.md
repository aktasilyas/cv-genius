# Domain Layer

Bu klasör Domain-Driven Design (DDD) prensiplerine göre yapılandırılmış CV Genius domain katmanını içerir.

## Yapı

```
domain/
├── entities/           # İş mantığı ve kuralları içeren entity'ler
│   ├── PersonalInfo.ts
│   ├── Experience.ts
│   ├── Education.ts
│   ├── Skill.ts
│   ├── Language.ts
│   ├── Certificate.ts
│   ├── CVData.ts      # Aggregate Root
│   ├── TemplateCustomization.ts
│   └── CVVersion.ts
├── value-objects/     # Değişmez değer objeleri
│   ├── SkillLevel.ts
│   ├── LanguageProficiency.ts
│   ├── DateRange.ts
│   ├── CVTemplate.ts
│   └── CVCreationMode.ts
└── interfaces/        # Servis ve repository interface'leri
    ├── ICVRepository.ts
    └── IAIService.ts
```

## Entities

### PersonalInfo
Kullanıcının kişisel bilgilerini temsil eder.

```typescript
import { createPersonalInfo, PersonalInfo } from '@/domain';

const personalInfo = createPersonalInfo({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  location: 'New York, USA',
  title: 'Software Engineer'
});
```

### Experience
İş deneyimi bilgilerini temsil eder. Tarih validasyonu içerir.

```typescript
import { createExperience, Experience } from '@/domain';

const experience = createExperience({
  company: 'Tech Corp',
  position: 'Senior Developer',
  startDate: '2020-01',
  endDate: '2023-12',
  current: false,
  description: 'Leading development team...',
  achievements: ['Built scalable API', 'Mentored junior developers']
});
```

### CVData (Aggregate Root)
Tüm CV verilerini bir araya getiren ana entity. CV'nin bütünlüğünü sağlar.

```typescript
import { createCVData, CVData } from '@/domain';

const cvData = createCVData({
  personalInfo,
  summary: 'Experienced software engineer...',
  experience: [experience],
  education: [],
  skills: [],
  languages: [],
  certificates: []
});

// Check if CV is complete
import { isComplete } from '@/domain';
if (isComplete(cvData)) {
  console.log('CV is ready for export');
}
```

## Value Objects

### SkillLevel
Yetenek seviyelerini temsil eder.

```typescript
import { SkillLevel, getSkillLevelLabel } from '@/domain';

const level: SkillLevel = 'advanced';
console.log(getSkillLevelLabel(level)); // "Advanced"
```

### DateRange
Tarih aralıklarını temsil eder ve validasyon içerir.

```typescript
import { createDateRange, formatDateRange } from '@/domain';

const dateRange = createDateRange('2020-01', '2023-12', false);
console.log(formatDateRange(dateRange)); // "2020-01 - 2023-12"
```

## Interfaces

### ICVRepository
CV verilerinin kalıcılığı için repository interface'i.

```typescript
import { ICVRepository, CVData } from '@/domain';

class LocalStorageCVRepository implements ICVRepository {
  async save(cvData: CVData): Promise<void> {
    localStorage.setItem('cv', JSON.stringify(cvData));
  }

  async load(): Promise<CVData | null> {
    const data = localStorage.getItem('cv');
    return data ? JSON.parse(data) : null;
  }

  async clear(): Promise<void> {
    localStorage.removeItem('cv');
  }

  async exists(): Promise<boolean> {
    return localStorage.getItem('cv') !== null;
  }
}
```

### IAIService
AI tabanlı CV analizi ve iyileştirme servisleri için interface.

```typescript
import { IAIService, CVData, AIFeedback } from '@/domain';

class OpenAIService implements IAIService {
  async analyzeCv(cvData: CVData): Promise<AIFeedback[]> {
    // OpenAI API call
    return [];
  }

  async scoreCv(cvData: CVData): Promise<CVScore> {
    // Scoring logic
    return {
      overall: 85,
      breakdown: {
        completeness: 90,
        quality: 85,
        atsCompatibility: 80,
        impact: 85
      },
      recommendations: []
    };
  }

  // ... other methods
}
```

## Validation

Her entity Zod schema'ları kullanarak validation yapar:

```typescript
import { ExperienceSchema, validateExperience } from '@/domain';

// Direct schema validation
const result = ExperienceSchema.safeParse(data);
if (!result.success) {
  console.error(result.error);
}

// Type guard validation
if (validateExperience(data)) {
  // data is typed as Experience
}
```

## Factory Functions

Her entity için factory function'lar mevcuttur:

```typescript
import {
  createPersonalInfo,
  createExperience,
  createEducation,
  createSkill,
  createLanguage,
  createCertificate
} from '@/domain';

// Factory functions handle ID generation and default values
const skill = createSkill({
  name: 'TypeScript',
  level: 'expert'
});
// skill.id is automatically generated
```

## Migration from Old Structure

Eski `src/types/cv.ts` dosyası geriye uyumluluk için korunmuştur ve domain layer'dan re-export yapar:

```typescript
// Old way (still works)
import { CVData } from '@/types/cv';

// New way (recommended)
import { CVData } from '@/domain';
```

## Best Practices

1. **Validation First**: Entity oluştururken her zaman factory function'ları kullanın
2. **Immutability**: Entity'leri update ederken yeni instance oluşturun
3. **Type Safety**: Zod schema'larını kullanarak runtime type safety sağlayın
4. **Domain Logic**: İş kurallarını entity'lerin içinde tutun
5. **Interface Segregation**: Repository ve service interface'lerini kullanarak bağımlılıkları azaltın
