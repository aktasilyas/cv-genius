# Migration Guide: Context Refactoring

Bu guide, eski `CVContext` yapısından yeni modüler context yapısına geçiş için adım adım talimatlar içerir.

## Değişiklik Özeti

### Eski Yapı
```
src/
  context/
    CVContext.tsx  (tek bir büyük context - 412 satır)
  types/
    cv.ts          (tüm type'lar bir arada)
```

### Yeni Yapı
```
src/
  domain/          (Domain entities & value objects)
  application/     (Application contexts & hooks)
    context/
      CVDataContext.tsx
      CVActionsContext.tsx
      CVUIContext.tsx
      AIContext.tsx
      VersionContext.tsx
    hooks/
      useCV.ts
    providers/
      AppProviders.tsx
```

## Adım 1: Import'ları Güncelle

### Basit Yöntem (Önerilen)
Tüm `useCVContext` kullanımlarını `useCV` ile değiştirin:

**Önce:**
```typescript
import { useCVContext } from '@/context/CVContext';

function MyComponent() {
  const { cvData, addExperience, currentStep } = useCVContext();
  // ...
}
```

**Sonra:**
```typescript
import { useCV } from '@/application';

function MyComponent() {
  const { cvData, addExperience, currentStep } = useCV();
  // ...
}
```

### Optimize Yöntem
Sadece ihtiyacınız olan context'leri kullanın (daha iyi performance):

**Örnek 1: Sadece veri gösterimi**
```typescript
import { useCVData } from '@/application';

function PersonalInfoDisplay() {
  const { cvData } = useCVData();
  return <div>{cvData.personalInfo.fullName}</div>;
}
```

**Örnek 2: Sadece actions**
```typescript
import { useCVActions } from '@/application';

function AddExperienceButton() {
  const { addExperience } = useCVActions();
  return <button onClick={addExperience}>Add</button>;
}
```

**Örnek 3: Birden fazla context**
```typescript
import { useCVData, useCVActions, useCVUI } from '@/application';

function ComplexComponent() {
  const { cvData } = useCVData();
  const { addExperience } = useCVActions();
  const { currentStep } = useCVUI();
  // ...
}
```

## Adım 2: Type Import'larını Güncelle

### Domain Types
**Önce:**
```typescript
import { CVData, Experience, Education } from '@/types/cv';
```

**Sonra:**
```typescript
import { CVData, Experience, Education } from '@/domain';
```

### AI Types
**Önce:**
```typescript
import { AIFeedback, CVScore, JobMatch } from '@/types/cv';
```

**Sonra:**
```typescript
import { AIFeedback, CVScore, JobMatch } from '@/domain';
```

## Adım 3: Factory Function'ları Kullan

Artık entity oluştururken factory function'ları kullanın:

**Önce:**
```typescript
const newExperience = {
  id: generateId(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  achievements: []
};
```

**Sonra:**
```typescript
import { createExperience } from '@/domain';

const newExperience = createExperience({
  company: 'Tech Corp',
  position: 'Developer'
  // Diğer alanlar otomatik olarak default değerlerle doldurulur
  // ID otomatik generate edilir
});
```

## Adım 4: Validation Ekle

Zod schema'larını kullanarak validation ekleyin:

```typescript
import { ExperienceSchema, validateExperience } from '@/domain';

// Schema ile doğrudan validation
const result = ExperienceSchema.safeParse(data);
if (result.success) {
  const validExperience = result.data;
}

// Type guard ile validation
if (validateExperience(data)) {
  // data artık Experience type'ı
}
```

## API Değişiklikleri

### Değişmeyen API'lar
Aşağıdaki API'lar aynı şekilde çalışır:
- `cvData`, `setCVData`
- `updatePersonalInfo(field, value)`
- `updateSummary(value)`
- `add*()`, `update*(id, field, value)`, `remove*(id)` metodları
- `currentStep`, `setCurrentStep`
- `selectedTemplate`, `setSelectedTemplate`
- `aiFeedback`, `isAnalyzing`, `cvScore`, `jobMatch`
- `versions`, `saveVersion`, `restoreVersion`

### Yeni API'lar
- `clearAIData()` - Tüm AI verilerini temizler
- `clearVersions()` - Tüm version history'yi temizler

## Component Örnekleri

### Örnek 1: Personal Info Form

**Önce:**
```typescript
import { useCVContext } from '@/context/CVContext';

function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVContext();

  return (
    <input
      value={cvData.personalInfo.fullName}
      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
    />
  );
}
```

**Sonra (Basit):**
```typescript
import { useCV } from '@/application';

function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCV();

  return (
    <input
      value={cvData.personalInfo.fullName}
      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
    />
  );
}
```

**Sonra (Optimize):**
```typescript
import { useCVData, useCVActions } from '@/application';

function PersonalInfoForm() {
  const { cvData } = useCVData();
  const { updatePersonalInfo } = useCVActions();

  return (
    <input
      value={cvData.personalInfo.fullName}
      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
    />
  );
}
```

### Örnek 2: Experience List

**Önce:**
```typescript
import { useCVContext } from '@/context/CVContext';

function ExperienceList() {
  const { cvData, addExperience, removeExperience } = useCVContext();

  return (
    <div>
      {cvData.experience.map(exp => (
        <div key={exp.id}>
          {exp.company}
          <button onClick={() => removeExperience(exp.id)}>Remove</button>
        </div>
      ))}
      <button onClick={addExperience}>Add</button>
    </div>
  );
}
```

**Sonra:**
```typescript
import { useCV } from '@/application';

function ExperienceList() {
  const { cvData, addExperience, removeExperience } = useCV();

  return (
    <div>
      {cvData.experience.map(exp => (
        <div key={exp.id}>
          {exp.company}
          <button onClick={() => removeExperience(exp.id)}>Remove</button>
        </div>
      ))}
      <button onClick={addExperience}>Add</button>
    </div>
  );
}
```

### Örnek 3: AI Feedback Display

**Önce:**
```typescript
import { useCVContext } from '@/context/CVContext';

function AIFeedbackPanel() {
  const { aiFeedback, isAnalyzing, cvScore } = useCVContext();

  if (isAnalyzing) return <div>Analyzing...</div>;

  return (
    <div>
      Score: {cvScore?.overall}
      {aiFeedback.map(feedback => (
        <div key={feedback.id}>{feedback.message}</div>
      ))}
    </div>
  );
}
```

**Sonra (Optimize):**
```typescript
import { useAI } from '@/application';

function AIFeedbackPanel() {
  const { aiFeedback, isAnalyzing, cvScore } = useAI();

  if (isAnalyzing) return <div>Analyzing...</div>;

  return (
    <div>
      Score: {cvScore?.overall}
      {aiFeedback.map(feedback => (
        <div key={feedback.id}>{feedback.message}</div>
      ))}
    </div>
  );
}
```

## Testing

### Context Test Örneği

**CVDataContext Test:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { CVDataProvider, useCVData } from '@/application';

describe('CVDataContext', () => {
  it('should update CV data', () => {
    const wrapper = ({ children }) => (
      <CVDataProvider>{children}</CVDataProvider>
    );

    const { result } = renderHook(() => useCVData(), { wrapper });

    act(() => {
      result.current.setCVData(prev => ({
        ...prev,
        summary: 'New summary'
      }));
    });

    expect(result.current.cvData.summary).toBe('New summary');
  });
});
```

## Troubleshooting

### Problem 1: "useCVData must be used within CVDataProvider"
**Çözüm:** App.tsx'de AppProviders kullandığınızdan emin olun:

```typescript
import { AppProviders } from '@/application';

function App() {
  return (
    <AppProviders>
      <YourApp />
    </AppProviders>
  );
}
```

### Problem 2: Type errors
**Çözüm:** Import path'lerini kontrol edin:
- Domain types: `@/domain`
- Application hooks: `@/application`

### Problem 3: LocalStorage data invalid
**Çözüm:** Yeni Zod validation geçersiz veriyi otomatik temizler. Eğer sorun devam ederse:

```typescript
localStorage.removeItem('cv-data');
```

## Checklist

- [ ] App.tsx'de AppProviders eklendi
- [ ] Tüm `useCVContext` import'ları `useCV` ile değiştirildi
- [ ] Type import'ları `@/domain` kullanıyor
- [ ] Factory function'lar kullanılıyor (createExperience, vb.)
- [ ] Test'ler güncellendi
- [ ] LocalStorage temizlendi (isteğe bağlı)

## Kaynaklar

- [Domain Layer README](src/domain/README.md)
- [Application Layer README](src/application/README.md)
- [Type Definitions](src/domain/entities/)
- [Context Implementations](src/application/context/)

## Destek

Sorun yaşarsanız veya sorularınız varsa lütfen bir issue açın.
