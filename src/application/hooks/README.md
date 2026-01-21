# React Query Hooks

This directory contains React Query hooks that wrap Use Cases for easy component integration.

## Structure

```
hooks/
├── cv/                 # CV operations
│   ├── useUserCVs.ts
│   ├── useCVById.ts
│   ├── useCreateCV.ts
│   ├── useUpdateCV.ts
│   ├── useDeleteCV.ts
│   ├── useDuplicateCV.ts
│   ├── useSetDefaultCV.ts
│   ├── useExportCV.ts
│   └── index.ts
├── ai/                 # AI operations
│   ├── useAnalyzeCV.ts
│   ├── useParseCV.ts
│   ├── useJobMatch.ts
│   ├── useImproveText.ts
│   └── index.ts
├── queries/            # Query utilities
│   └── queryKeys.ts    # Query key factory
└── useCV.ts           # Legacy facade hook
```

## Query Hooks (Read Operations)

### useUserCVs

Fetch all CVs for the current user.

```typescript
import { useUserCVs } from '@/application/hooks/cv';

function CVList() {
  const { data, isLoading, error } = useUserCVs();

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

### useCVById

Fetch a single CV by ID.

```typescript
import { useCVById } from '@/application/hooks/cv';

function CVDetail({ id }: { id: string }) {
  const { data, isLoading } = useCVById(id);

  if (isLoading) return <Loading />;
  if (!data) return <NotFound />;

  return <CVView cv={data.cv} />;
}
```

## Mutation Hooks (Write Operations)

### useCreateCV

Create a new CV.

```typescript
import { useCreateCV } from '@/application/hooks/cv';

function CreateCVButton() {
  const createCV = useCreateCV();

  const handleCreate = () => {
    createCV.mutate({
      title: 'My Professional CV',
      cvData: initialCVData,
      template: 'modern'
    });
  };

  return (
    <button
      onClick={handleCreate}
      disabled={createCV.isPending}
    >
      {createCV.isPending ? 'Creating...' : 'Create CV'}
    </button>
  );
}
```

### useUpdateCV

Update an existing CV.

```typescript
import { useUpdateCV } from '@/application/hooks/cv';

function EditCVForm({ id, currentData }: Props) {
  const updateCV = useUpdateCV();

  const handleSave = (newData: CVData) => {
    updateCV.mutate({
      id,
      cvData: newData
    });
  };

  return (
    <form onSubmit={handleSave}>
      {/* Form fields */}
      <button type="submit" disabled={updateCV.isPending}>
        Save
      </button>
    </form>
  );
}
```

### useDeleteCV

Delete a CV.

```typescript
import { useDeleteCV } from '@/application/hooks/cv';

function DeleteButton({ id }: { id: string }) {
  const deleteCV = useDeleteCV();

  return (
    <button
      onClick={() => deleteCV.mutate(id)}
      disabled={deleteCV.isPending}
    >
      Delete
    </button>
  );
}
```

### useDuplicateCV

Duplicate a CV.

```typescript
import { useDuplicateCV } from '@/application/hooks/cv';

function DuplicateButton({ id }: { id: string }) {
  const duplicateCV = useDuplicateCV();

  return (
    <button onClick={() => duplicateCV.mutate(id)}>
      Duplicate
    </button>
  );
}
```

## AI Hooks

### useAnalyzeCV

Analyze CV and get score.

```typescript
import { useAnalyzeCV } from '@/application/hooks/ai';

function AnalyzeButton({ cvData }: { cvData: CVData }) {
  const analyzeCV = useAnalyzeCV();

  const handleAnalyze = () => {
    analyzeCV.mutate({ cvData }, {
      onSuccess: (result) => {
        console.log('Score:', result.score.overall);
      }
    });
  };

  return (
    <button onClick={handleAnalyze} disabled={analyzeCV.isPending}>
      {analyzeCV.isPending ? 'Analyzing...' : 'Analyze CV'}
    </button>
  );
}
```

### useParseCV

Parse CV text (LinkedIn, resume, etc.).

```typescript
import { useParseCV } from '@/application/hooks/ai';

function ImportLinkedIn() {
  const parseCV = useParseCV();

  const handleParse = (text: string) => {
    parseCV.mutate({ text }, {
      onSuccess: (result) => {
        setCVData(result.cvData);
      }
    });
  };

  return (
    <button onClick={() => handleParse(linkedInText)}>
      Import from LinkedIn
    </button>
  );
}
```

### useJobMatch

Match CV against job description.

```typescript
import { useJobMatch } from '@/application/hooks/ai';

function JobMatchButton({ cvData, jobDescription }: Props) {
  const matchJob = useJobMatch();

  const handleMatch = () => {
    matchJob.mutate({ cvData, jobDescription }, {
      onSuccess: (result) => {
        console.log('Match:', result.match.score);
        console.log('Matched keywords:', result.match.matchedKeywords);
      }
    });
  };

  return <button onClick={handleMatch}>Match with Job</button>;
}
```

### useImproveText

Improve text using AI.

```typescript
import { useImproveText } from '@/application/hooks/ai';

function ImproveButton({ text, context }: Props) {
  const improveText = useImproveText();

  const handleImprove = () => {
    improveText.mutate({ text, context }, {
      onSuccess: (result) => {
        setText(result.improvedText);
      }
    });
  };

  return <button onClick={handleImprove}>Improve with AI</button>;
}
```

## Features

### Automatic Cache Invalidation

Mutations automatically invalidate relevant queries:

```typescript
// When creating a CV
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
}

// When updating a CV
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
  queryClient.invalidateQueries({ queryKey: queryKeys.cvs.detail(variables.id) });
}
```

### Built-in Error Handling

All hooks include error handling with toast notifications:

```typescript
onError: (error) => {
  if (error instanceof ValidationError) {
    toast.error(error.message);
  } else if (error instanceof NotFoundError) {
    toast.error('CV not found');
  } else {
    toast.error('Failed to perform operation');
  }
}
```

### Loading States

All hooks provide loading states:

```typescript
const { isPending, isLoading, isError } = useCreateCV();
```

### Type Safety

All params and returns are fully typed:

```typescript
export interface CreateCVParams {
  title: string;
  cvData: CVData;
  template: CVTemplateType;
}
```

## Query Keys

Centralized query key management:

```typescript
import { queryKeys } from '@/application/hooks/queries/queryKeys';

// Use in hooks
queryKey: queryKeys.cvs.lists()
queryKey: queryKeys.cvs.detail(id)
queryKey: queryKeys.ai.analysis(cvId)
```

Benefits:
- Type-safe
- Centralized
- Easy to invalidate
- Prevents typos

## Best Practices

### 1. Use Optimistic Updates

```typescript
const updateCV = useUpdateCV();

updateCV.mutate(data, {
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.cvs.detail(id) });

    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKeys.cvs.detail(id));

    // Optimistically update
    queryClient.setQueryData(queryKeys.cvs.detail(id), newData);

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previous) {
      queryClient.setQueryData(queryKeys.cvs.detail(id), context.previous);
    }
  }
});
```

### 2. Handle Success/Error Callbacks

```typescript
createCV.mutate(data, {
  onSuccess: (result) => {
    navigate(`/cv/${result.cv.id}`);
  },
  onError: (error) => {
    console.error('Failed to create:', error);
  }
});
```

### 3. Use Enabled Option

```typescript
// Only fetch if ID is present
const { data } = useCVById(id);  // enabled: !!id is built-in
```

### 4. Combine Multiple Hooks

```typescript
function CVManager({ id }: { id: string }) {
  const { data } = useCVById(id);
  const updateCV = useUpdateCV();
  const deleteCV = useDeleteCV();
  const analyzeCV = useAnalyzeCV();

  // Use all hooks together
}
```

## Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserCVs } from './useUserCVs';

describe('useUserCVs', () => {
  it('should fetch CVs', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useUserCVs(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.cvs).toBeDefined();
  });
});
```

## Migration from Old Hooks

### Old Way (Direct Repository)

```typescript
const [cvs, setCVs] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchCVs = async () => {
    setLoading(true);
    const repo = getCVRepository();
    const data = await repo.getAll();
    setCVs(data);
    setLoading(false);
  };
  fetchCVs();
}, []);
```

### New Way (React Query Hook)

```typescript
const { data, isLoading } = useUserCVs();
```

Benefits:
- Less code
- Automatic caching
- Automatic refetching
- Better error handling
- Built-in loading states
