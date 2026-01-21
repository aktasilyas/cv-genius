# CV Genius

AI-powered CV builder with professional templates and smart analysis.

## 🏗️ Architecture

CV Genius is built using **Domain-Driven Design (DDD)** and **Clean Architecture** principles.

```
src/
├── domain/              # Business logic & rules (framework-agnostic)
│   ├── entities/        # Business objects
│   ├── value-objects/   # Immutable values
│   └── interfaces/      # Repository & service contracts
├── application/         # Use cases & state management
│   ├── context/         # React contexts (separated by concern)
│   ├── hooks/           # Custom hooks & facades
│   └── providers/       # Provider wrappers
├── infrastructure/      # External services & data access
│   ├── repositories/    # Database implementations
│   └── di/              # Dependency injection
├── pages/               # Route components
├── components/          # UI components
└── services/            # Legacy services (deprecated)
```

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md) - System architecture and design patterns
- [Domain Layer](src/domain/README.md) - Business entities and rules
- [Application Layer](src/application/README.md) - State management and hooks
- [Infrastructure Layer](src/infrastructure/README.md) - Repositories and DI
- [Migration Guide](MIGRATION_GUIDE.md) - Upgrading from old structure

## 🎯 Key Features

### For Users
- ✅ Professional CV templates
- ✅ AI-powered content analysis
- ✅ Job description matching
- ✅ Real-time preview
- ✅ PDF export
- ✅ Version history
- ✅ LinkedIn import

### For Developers
- ✅ Type-safe with TypeScript
- ✅ Runtime validation with Zod
- ✅ Repository pattern
- ✅ Dependency injection
- ✅ Clean architecture
- ✅ Comprehensive testing
- ✅ Well-documented codebase

## 🏛️ Architecture Highlights

### Domain-Driven Design

**Entities** with validation:
```typescript
import { createExperience, ExperienceSchema } from '@/domain';

const experience = createExperience({
  company: 'Tech Corp',
  position: 'Developer'
});

// Runtime validation
const result = ExperienceSchema.safeParse(data);
```

**Value Objects** for type safety:
```typescript
import { SkillLevel, LanguageProficiency } from '@/domain';

const level: SkillLevel = 'advanced'; // Type-safe
```

### Repository Pattern

Clean separation of concerns:
```typescript
import { getCVRepository } from '@/infrastructure';

const repo = getCVRepository();
const cvs = await repo.getAll();
await repo.create('My CV', cvData, 'modern');
```

### Context Separation

Organized state management:
```typescript
import { useCV } from '@/application';

function MyComponent() {
  const {
    cvData,        // From CVDataContext
    addExperience, // From CVActionsContext
    currentStep,   // From CVUIContext
    aiFeedback,    // From AIContext
    versions       // From VersionContext
  } = useCV();
}
```

## 🔄 Migration from Old Code

### Old Way (Deprecated)
```typescript
import { useCVContext } from '@/context/CVContext';
import { cvService } from '@/services/cvService';
import { CVData } from '@/types/cv';

const { cvData } = useCVContext();
const cvs = await cvService.getUserCVs();
```

### New Way (Recommended)
```typescript
import { useCV } from '@/application';
import { getCVRepository } from '@/infrastructure';
import { CVData } from '@/domain';

const { cvData } = useCV();
const repo = getCVRepository();
const cvs = await repo.getAll();
```

**Note:** Old imports still work but are deprecated for backward compatibility.

## 🧪 Testing

### Unit Tests (Domain)
```typescript
import { createExperience } from '@/domain';

describe('createExperience', () => {
  it('should generate ID automatically', () => {
    const exp = createExperience({});
    expect(exp.id).toBeDefined();
  });
});
```

### Integration Tests (Application)
```typescript
import { renderHook } from '@testing-library/react';
import { useCV } from '@/application';

describe('useCV', () => {
  it('should add experience', () => {
    const { result } = renderHook(() => useCV());
    act(() => result.current.addExperience());
    expect(result.current.cvData.experience).toHaveLength(1);
  });
});
```

## 📦 Key Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Zod** - Runtime validation
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Supabase** - Backend (database, auth, storage)
- **React Query** - Server state management
- **React PDF** - PDF generation

## 🎨 Available Templates

### Free Templates
- Modern
- Classic

### Premium Templates
- Minimal
- Creative
- Executive
- Technical

## 💳 Pricing

| Feature | Free | Premium |
|---------|------|---------|
| Templates | 2 | 6 |
| Max CVs | 1 | Unlimited |
| AI Analysis | ❌ | ✅ |
| Job Matching | ❌ | ✅ |
| Version History | ❌ | ✅ |
| Watermark Free | ❌ | ✅ |

**Premium:** 59₺/month or 499₺/year (~42₺/month)

## 🏗️ Project Structure

```
cv-genius/
├── src/
│   ├── domain/              # 🎯 Business logic (pure)
│   │   ├── entities/        # CVData, Experience, etc.
│   │   ├── value-objects/   # SkillLevel, LanguageProficiency
│   │   └── interfaces/      # ICVRepository, IAIService
│   ├── application/         # 🔄 State & use cases
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── providers/       # Provider wrappers
│   ├── infrastructure/      # 🔌 External services
│   │   ├── repositories/    # Supabase implementations
│   │   └── di/              # Dependency injection
│   ├── pages/               # 📄 Route components
│   ├── components/          # 🎨 UI components
│   ├── templates/           # 📋 CV templates
│   └── services/            # ⚠️ Legacy (deprecated)
├── ARCHITECTURE.md          # Architecture guide
├── MIGRATION_GUIDE.md       # Migration instructions
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow Clean Architecture principles
- Use Domain-Driven Design patterns
- Write type-safe code with TypeScript
- Add Zod validation for data
- Write tests for new features
- Document complex logic

## 📧 Project Info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

For more information about deployment and custom domains, visit [Lovable Documentation](https://docs.lovable.dev/).

---

**Made with ❤️ using Clean Architecture & DDD**
