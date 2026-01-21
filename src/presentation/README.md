# Presentation Layer

This directory contains presentation-layer components and hooks for error handling and UI.

## Structure

```
presentation/
├── components/
│   └── error/
│       ├── ErrorBoundary.tsx       # React Error Boundary
│       ├── ErrorFallback.tsx       # Error UI fallback
│       ├── GlobalErrorHandler.tsx  # Global error catcher
│       └── index.ts
└── hooks/
    ├── useErrorHandler.ts          # Centralized error handling
    └── index.ts
```

## Error Handling System

### Overview

CV Genius uses a comprehensive error handling system with multiple layers:

1. **Error Boundary** - Catches React component errors
2. **Global Error Handler** - Catches unhandled promises and global errors
3. **useErrorHandler Hook** - Centralized error handling logic
4. **Error Logger** - Logs errors for debugging and monitoring
5. **Error Messages** - Localized error messages

### Error Boundary

Catches errors in the React component tree and displays a fallback UI.

```typescript
import { ErrorBoundary } from '@/presentation/components/error';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

**Features:**
- Catches component lifecycle errors
- Displays user-friendly error UI
- Logs errors automatically
- Provides reset functionality

**Custom Fallback:**
```typescript
<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, info) => {
    console.log('Custom error handler', error);
  }}
>
  <YourApp />
</ErrorBoundary>
```

### Global Error Handler

Catches unhandled promise rejections and global errors.

```typescript
import { GlobalErrorHandler } from '@/presentation/components/error';

function App() {
  return (
    <GlobalErrorHandler>
      <YourApp />
    </GlobalErrorHandler>
  );
}
```

**Catches:**
- Unhandled promise rejections
- Global JavaScript errors
- Network errors
- Async operation failures

### useErrorHandler Hook

Centralized error handling with consistent UI feedback.

```typescript
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';

function MyComponent() {
  const { handleError } = useErrorHandler();

  const loadData = async () => {
    try {
      const data = await fetchData();
    } catch (error) {
      handleError(error);
    }
  };
}
```

**Options:**
```typescript
handleError(error, {
  showToast: true,        // Show toast notification
  redirectOnAuth: true,   // Redirect to login on auth error
  logError: true,         // Log error to console/service
  context: { ... }        // Additional context
});
```

**Error Types Handled:**

| Error Type | Action |
|------------|--------|
| `ValidationError` | Show field-specific errors |
| `AuthenticationError` | Redirect to login |
| `AuthorizationError` | Show permission error |
| `NotFoundError` | Show not found message |
| `ConflictError` | Show conflict message |
| `RateLimitError` | Show rate limit message |
| `AppError` | Show generic app error |
| `TypeError (fetch)` | Show network error |
| `Unknown` | Show generic error |

### Error Messages

Localized error messages with multi-language support.

```typescript
import { getErrorMessage } from '@/application/errors/errorMessages';

const message = getErrorMessage('AUTH_ERROR', 'en');
// "Please sign in to continue"

const message = getErrorMessage('AUTH_ERROR', 'tr');
// "Devam etmek için giriş yapın"
```

**Available Messages:**
- General errors (VALIDATION_ERROR, NOT_FOUND, etc.)
- CV errors (CV_CREATE_FAILED, CV_UPDATE_FAILED, etc.)
- Auth errors (SIGN_IN_FAILED, INVALID_CREDENTIALS, etc.)
- AI errors (AI_ANALYSIS_FAILED, AI_RATE_LIMIT, etc.)
- Subscription errors (PREMIUM_REQUIRED, PAYMENT_FAILED, etc.)

### Error Logger

Logs errors for debugging and monitoring.

```typescript
import { errorLogger } from '@/application/errors/errorLogger';

// Log manually
errorLogger.log(error, { userId: '123', action: 'createCV' });

// Get logs
const logs = errorLogger.getLogs();
const recent = errorLogger.getRecentLogs(10);

// Get statistics
const stats = errorLogger.getStats();
// { total: 42, byCode: { AUTH_ERROR: 5, ... }, last24h: 12 }

// Export logs
const json = errorLogger.exportLogs();

// Clear logs
errorLogger.clear();
```

**Features:**
- Persists to localStorage
- Limits to 100 logs
- Includes stack traces
- Tracks context
- Sends to external service in production

## Usage Examples

### Example 1: Component with Error Handling

```typescript
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';
import { useCreateCV } from '@/application/hooks/cv';

function CreateCVButton() {
  const createCV = useCreateCV();
  const { handleError } = useErrorHandler();

  const handleCreate = async () => {
    try {
      await createCV.mutateAsync({ title, cvData, template });
    } catch (error) {
      handleError(error);
    }
  };

  return <button onClick={handleCreate}>Create CV</button>;
}
```

### Example 2: React Query with Error Handling

```typescript
import { useUserCVs } from '@/application/hooks/cv';
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';
import { useEffect } from 'react';

function CVList() {
  const { data, error } = useUserCVs();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error, handleError]);

  return (
    <div>
      {data?.cvs.map(cv => <CVCard key={cv.id} cv={cv} />)}
    </div>
  );
}
```

### Example 3: Custom Error Message

```typescript
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';

function MyComponent() {
  const { handleErrorWithMessage } = useErrorHandler();

  const doSomething = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      handleErrorWithMessage(
        error,
        'Failed to complete operation. Please try again later.'
      );
    }
  };
}
```

### Example 4: Validation Error Display

```typescript
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';
import { ValidationError } from '@/application/errors/AppError';

function FormComponent() {
  const { handleError } = useErrorHandler();

  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Will show each field error as a separate toast
        handleError(error);
      }
    }
  };
}
```

## App.tsx Integration

```typescript
import { ErrorBoundary, GlobalErrorHandler } from '@/presentation/components/error';

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <GlobalErrorHandler>
        <AppProviders>
          {/* Your app */}
        </AppProviders>
      </GlobalErrorHandler>
    </QueryClientProvider>
  </ErrorBoundary>
);
```

**Layer Order:**
1. **ErrorBoundary** (outermost) - Catches React errors
2. **QueryClientProvider** - React Query
3. **GlobalErrorHandler** - Catches promise rejections
4. **AppProviders** - Application contexts

## Error Flow

```
┌─────────────────────────────────────┐
│ Component throws error              │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Error Boundary catches               │
│ - Logs to errorLogger               │
│ - Shows ErrorFallback UI            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Unhandled Promise Rejection         │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ GlobalErrorHandler catches          │
│ - Calls useErrorHandler             │
│ - Shows toast notification          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Try-catch in component              │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ handleError called                  │
│ - Determines error type             │
│ - Shows appropriate message         │
│ - Logs error                        │
│ - Redirects if needed               │
└─────────────────────────────────────┘
```

## Best Practices

### 1. Use Error Boundaries Strategically

```typescript
// Good: Wrap routes
<ErrorBoundary>
  <Routes />
</ErrorBoundary>

// Good: Wrap critical features
<ErrorBoundary>
  <CVBuilder />
</ErrorBoundary>

// Bad: Too granular
<ErrorBoundary>
  <Button />
</ErrorBoundary>
```

### 2. Always Handle Promise Rejections

```typescript
// Good
try {
  await asyncOperation();
} catch (error) {
  handleError(error);
}

// Bad
asyncOperation(); // Unhandled rejection
```

### 3. Provide Context

```typescript
// Good
handleError(error, {
  context: {
    action: 'createCV',
    cvId: cv.id,
    userId: user.id
  }
});

// Bad
handleError(error); // No context
```

### 4. Use Specific Error Types

```typescript
// Good
throw new ValidationError('Invalid email', {
  email: 'Email format is invalid'
});

// Bad
throw new Error('Validation failed');
```

### 5. Don't Swallow Errors

```typescript
// Bad
try {
  await operation();
} catch (error) {
  // Silent failure
}

// Good
try {
  await operation();
} catch (error) {
  handleError(error);
}
```

## Testing

```typescript
import { renderHook } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';
import { ValidationError } from '@/application/errors/AppError';

describe('useErrorHandler', () => {
  it('should handle ValidationError', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = new ValidationError('Invalid', {
      email: 'Invalid email'
    });

    result.current.handleError(error);

    // Assert toast was called
  });
});
```

## Monitoring

In production, errors are automatically sent to external monitoring services:

```typescript
// errorLogger.ts
private async sendToExternalService(log: ErrorLog): Promise<void> {
  // Integrate with:
  // - Sentry
  // - LogRocket
  // - Custom endpoint
  await fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(log)
  });
}
```

## Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling Best Practices](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)
- [Application Errors](../../application/errors/README.md)
