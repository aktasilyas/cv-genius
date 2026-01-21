# Application Layer

Bu klasör CV Genius'un application layer'ını içerir. Context'ler, hooks, use cases ve provider'lar burada tanımlanır.

## Yapı

```
application/
├── context/           # Ayrıştırılmış context'ler
│   ├── CVDataContext.tsx      # CV verisi state management
│   ├── CVActionsContext.tsx   # CRUD operasyonları
│   ├── CVUIContext.tsx        # UI state (step, template, modal)
│   ├── AIContext.tsx          # AI feedback ve analiz
│   └── VersionContext.tsx     # Version history
├── hooks/            # Custom hooks
│   └── useCV.ts      # Facade hook (tüm context'leri birleştirir)
├── providers/        # Provider wrappers
│   └── AppProviders.tsx  # Tüm provider'ları saran wrapper
├── use-cases/        # Business logic use cases
│   ├── cv/           # CV işlemleri (Create, Update, Delete, vb.)
│   ├── auth/         # Authentication (SignIn, SignUp, vb.)
│   └── ai/           # AI işlemleri (Analyze, Parse, Match, vb.)
└── errors/           # Application errors
    └── AppError.ts   # Base error classes
```

## Context'ler

### CVDataContext
CV verilerinin state management'ı.

```typescript
import { useCVData } from '@/application';

function MyComponent() {
  const { cvData, setCVData } = useCVData();

  return <div>{cvData.personalInfo.fullName}</div>;
}
```

### CVActionsContext
CV verileri üzerinde CRUD operasyonları.

```typescript
import { useCVActions } from '@/application';

function MyComponent() {
  const {
    addExperience,
    updateExperience,
    removeExperience,
    resetCV
  } = useCVActions();

  return (
    <button onClick={addExperience}>
      Add Experience
    </button>
  );
}
```

**Mevcut metodlar:**
- `updatePersonalInfo(field, value)`
- `updateSummary(value)`
- `addExperience()`, `updateExperience(id, field, value)`, `removeExperience(id)`
- `addEducation()`, `updateEducation(id, field, value)`, `removeEducation(id)`
- `addSkill()`, `updateSkill(id, field, value)`, `removeSkill(id)`
- `addLanguage()`, `updateLanguage(id, field, value)`, `removeLanguage(id)`
- `addCertificate()`, `updateCertificate(id, field, value)`, `removeCertificate(id)`
- `toggleSectionVisibility(section)`
- `updateSectionOrder(newOrder)`
- `resetCV()`

### CVUIContext
UI state management (adımlar, template seçimi, modal'lar).

```typescript
import { useCVUI } from '@/application';

function MyComponent() {
  const {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    setSelectedTemplate,
    templateCustomization,
    setTemplateCustomization,
    creationMode,
    setCreationMode
  } = useCVUI();

  return (
    <div>
      Current step: {currentStep}
      Template: {selectedTemplate}
    </div>
  );
}
```

### AIContext
AI feedback, scoring ve analiz state'i.

```typescript
import { useAI } from '@/application';

function MyComponent() {
  const {
    aiFeedback,
    setAIFeedback,
    isAnalyzing,
    setIsAnalyzing,
    cvScore,
    setCVScore,
    jobMatch,
    setJobMatch,
    clearAIData
  } = useAI();

  return (
    <div>
      {isAnalyzing ? 'Analyzing...' : `Score: ${cvScore?.overall}`}
    </div>
  );
}
```

### VersionContext
CV version history yönetimi.

```typescript
import { useVersion } from '@/application';

function MyComponent() {
  const {
    versions,
    saveVersion,
    restoreVersion,
    clearVersions
  } = useVersion();

  return (
    <button onClick={() => saveVersion('Before changes')}>
      Save Version
    </button>
  );
}
```

## Hooks

### useCV (Facade Hook)
Tüm context'leri tek bir hook'ta birleştirir. **Önerilen kullanım yöntemi.**

```typescript
import { useCV } from '@/application';

function MyComponent() {
  const {
    // CVData
    cvData,
    setCVData,

    // Actions
    addExperience,
    updateExperience,
    removeExperience,
    resetCV,

    // UI
    currentStep,
    setCurrentStep,
    selectedTemplate,

    // AI
    aiFeedback,
    isAnalyzing,
    cvScore,

    // Versions
    versions,
    saveVersion,
    restoreVersion
  } = useCV();

  return <div>All context values accessible here</div>;
}
```

## Providers

### AppProviders
Tüm context provider'larını saran wrapper. Uygulamanın root'unda kullanılmalı.

```typescript
// main.tsx veya App.tsx
import { AppProviders } from '@/application';

function App() {
  return (
    <AppProviders>
      <YourApp />
    </AppProviders>
  );
}
```

**Provider sırası (içten dışa):**
1. CVDataProvider (en içte - temel veri)
2. CVActionsProvider (CVData'ya bağımlı)
3. CVUIProvider
4. AIProvider
5. VersionProvider (en dışta)

## Migration Guide

### Eski kullanım:
```typescript
import { useCVContext } from '@/context/CVContext';

function MyComponent() {
  const { cvData, addExperience, currentStep } = useCVContext();
  // ...
}
```

### Yeni kullanım (Önerilen):
```typescript
import { useCV } from '@/application';

function MyComponent() {
  const { cvData, addExperience, currentStep } = useCV();
  // ...
}
```

### Alternatif (Spesifik context):
```typescript
import { useCVData, useCVActions, useCVUI } from '@/application';

function MyComponent() {
  const { cvData } = useCVData();
  const { addExperience } = useCVActions();
  const { currentStep } = useCVUI();
  // ...
}
```

## Avantajlar

### Separation of Concerns
Her context tek bir sorumluluğa sahip:
- **CVDataContext**: Sadece veri state'i
- **CVActionsContext**: Sadece veri işlemleri
- **CVUIContext**: Sadece UI state'i
- **AIContext**: Sadece AI özellikleri
- **VersionContext**: Sadece versiyon yönetimi

### Performance
- Her context'in kendi memoization'ı var
- Component'ler sadece ihtiyaç duydukları context'e subscribe olabilir
- Gereksiz re-render'lar azalır

### Testability
- Her context bağımsız olarak test edilebilir
- Mock'lama daha kolay

### Maintainability
- Kod daha organize
- Her dosya tek bir sorumluluğa odaklanır
- Yeni özellik eklemek daha kolay

## Best Practices

1. **Facade Hook Kullanın**: Çoğu durumda `useCV()` kullanın
2. **Spesifik Context'ler**: Sadece belirli bir context'e ihtiyacınız varsa spesifik hook kullanın
3. **Provider Sırası**: AppProviders kullanarak doğru sırayı garanti edin
4. **Memoization**: Callback'lerde useCallback kullanın
5. **Type Safety**: TypeScript type'larını kullanarak hataları önleyin

## Backwards Compatibility

Eski `src/context/CVContext.tsx` dosyası hala çalışır ancak deprecated:

```typescript
// Eski (hala çalışır ama deprecated)
import { useCVContext } from '@/context/CVContext';

// Yeni (önerilen)
import { useCV } from '@/application';
```
