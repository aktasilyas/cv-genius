# CV Genius - AI-Powered CV Builder

Modern, ATS-friendly CV builder with professional templates and AI-powered analysis. Built with Clean Architecture and SOLID principles.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

- 🎨 **6 Professional Templates** - Modern, Classic, Minimal, Creative, Executive, Technical
- 🤖 **AI-Powered Analysis** - Get instant feedback and suggestions
- 📊 **ATS Optimization** - Score and improve your CV for applicant tracking systems
- 💾 **Auto-Save** - Never lose your work with automatic saving
- 🌍 **i18n Support** - Multi-language support (EN, TR)
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Secure** - Built with Supabase authentication and RLS

## 🏗️ Architecture

CV Genius follows **Clean Architecture** with **Domain-Driven Design (DDD)** principles.

```
src/
├── domain/              # Enterprise Business Rules
│   ├── entities/        # Core business objects (CVData, Experience, etc.)
│   ├── value-objects/   # Immutable values (SkillLevel, CVTemplate)
│   └── interfaces/      # Repository contracts (ICVRepository, IAIRepository)
├── application/         # Application Business Rules
│   ├── use-cases/       # Single responsibility operations
│   ├── context/         # React contexts (split by concern)
│   ├── hooks/           # React Query hooks
│   ├── errors/          # Error handling system
│   └── providers/       # Provider composition
├── infrastructure/      # Frameworks & Drivers
│   ├── repositories/    # Supabase implementations
│   ├── di/              # Dependency injection container
│   └── config/          # Application configuration
├── presentation/        # Interface Adapters (UI)
│   ├── components/      # React components
│   ├── pages/           # Route pages
│   ├── routes/          # Router configuration
│   └── hooks/           # UI-specific hooks
├── shared/              # Shared utilities
│   ├── lib/             # Utility functions
│   └── types/           # Shared types
└── __tests__/           # Tests organized by layer
    ├── domain/
    ├── application/
    ├── presentation/
    └── mocks/
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd cv-genius

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui
- **State Management**: TanStack Query, React Context
- **Backend**: Supabase (Auth, Database, Storage)
- **Validation**: Zod
- **Testing**: Vitest, Testing Library
- **AI**: OpenAI API

## 📜 Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # ESLint
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
npm run test:domain      # Run domain tests only
npm run test:application # Run application tests only
npm run test:presentation # Run presentation tests only
```

## 📚 Documentation

- [Architecture Guide](./CLEAN_ARCHITECTURE_COMPLETE.md) - Detailed architecture documentation
- [Performance Guide](./PERFORMANCE.md) - Performance optimization guide
- [Testing Guide](./TESTING.md) - Testing strategies and examples
- [Migration Guide](./MIGRATION_GUIDE.md) - Migration from old to new architecture
- [Use Cases Guide](./USE_CASES_GUIDE.md) - Use cases documentation

### Additional Docs

- [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute
- [API Reference](./docs/API.md) - Hook and API documentation
- [Architecture Details](./docs/ARCHITECTURE.md) - Layer-by-layer breakdown

## 🧪 Testing

CV Genius has comprehensive test coverage across all layers:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific layer tests
npm run test:domain
npm run test:application
npm run test:presentation
```

**Coverage Targets**:
- Domain Layer: 90%+
- Application Layer: 80%+
- Infrastructure Layer: 70%+
- Presentation Layer: 60%+

## 🎯 Key Concepts

### Clean Architecture

Dependencies flow inward:
```
Presentation → Application → Domain ← Infrastructure
```

Domain layer has zero dependencies - pure business logic.

### Path Aliases

```typescript
import { CVData } from '@domain/entities';
import { useUserCVs } from '@application/hooks/cv';
import { SupabaseCVRepository } from '@infrastructure/repositories';
import { ErrorBoundary } from '@presentation/components/error';
import { cn } from '@shared/lib';
```

### Use Case Pattern

```typescript
// Single responsibility business logic
export class CreateCVUseCase {
  constructor(private readonly repository: ICVRepository) {}

  async execute(input: CreateCVInput): Promise<CreateCVOutput> {
    // Validation
    // Business logic
    // Repository call
  }
}
```

### Repository Pattern

```typescript
// Domain interface
export interface ICVRepository {
  getAll(): Promise<SavedCV[]>;
  create(data: CVData): Promise<SavedCV>;
}

// Infrastructure implementation
export class SupabaseCVRepository implements ICVRepository {
  async getAll() { /* Supabase-specific */ }
  async create(data: CVData) { /* Supabase-specific */ }
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) first.

### Branch Strategy

- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code improvements
- `docs/*` - Documentation

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
refactor: code restructuring
test: add/update tests
docs: documentation
chore: maintenance
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend infrastructure
- [TanStack Query](https://tanstack.com/query) - Data fetching and state management
- [Zod](https://zod.dev/) - Schema validation

## 📞 Support

For issues and questions:
- Open an [Issue](https://github.com/your-repo/issues)
- Check [Documentation](./docs/)
- Read [FAQ](./docs/FAQ.md)

---

Built with ❤️ using Clean Architecture principles
