# Performance Hooks

This directory contains React hooks designed to optimize application performance by controlling when and how often expensive operations execute.

## Available Hooks

### useDebounce

Delays updating a value until after a specified delay has passed since the last change.

**When to use:**
- Search inputs (wait for user to stop typing)
- Form auto-save (batch multiple changes)
- API calls triggered by user input
- Real-time validation

**Example:**
```typescript
import { useDebounce } from '@/application/hooks/performance';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // This only runs after user stops typing for 500ms
    searchAPI(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Benefits:**
- Reduces API calls by 90%+
- Improves UI responsiveness
- Reduces server load

---

### useDebouncedCallback

Creates a debounced version of a callback function.

**When to use:**
- Event handlers that trigger expensive operations
- Form submission handlers
- Auto-save functionality

**Example:**
```typescript
import { useDebouncedCallback } from '@/application/hooks/performance';

function AutoSaveForm() {
  const [formData, setFormData] = useState({});

  const debouncedSave = useDebouncedCallback(
    (data) => {
      saveToServer(data);
    },
    1000
  );

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    debouncedSave(newData); // Only saves after 1s of no changes
  };

  return (
    <form>
      <input onChange={(e) => handleChange('name', e.target.value)} />
      <input onChange={(e) => handleChange('email', e.target.value)} />
    </form>
  );
}
```

**Benefits:**
- Batches multiple operations
- Reduces network traffic
- Better user experience

---

### useThrottle

Limits how often a function can be called (rate limiting).

**When to use:**
- Scroll handlers
- Resize handlers
- Mouse move tracking
- Animation frame callbacks

**Example:**
```typescript
import { useThrottle } from '@/application/hooks/performance';

function InfiniteScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const throttledScroll = useThrottle(
    (scrollY) => {
      setScrollPosition(scrollY);
      if (scrollY > threshold) {
        loadMoreItems();
      }
    },
    200 // Maximum once every 200ms
  );

  useEffect(() => {
    const handleScroll = () => throttledScroll(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttledScroll]);

  return <div>Scroll position: {scrollPosition}</div>;
}
```

**Benefits:**
- Prevents performance degradation
- Smooth UI interactions
- Controlled resource usage

---

### useMemoizedCallback

Creates a stable callback reference that always calls the latest version.

**When to use:**
- Callbacks passed to memoized child components
- Event handlers that need latest state
- Avoiding dependency array issues

**Example:**
```typescript
import { useMemoizedCallback } from '@/application/hooks/performance';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState('');

  // This callback always has latest count, but stable reference
  const handleClick = useMemoizedCallback(() => {
    console.log('Current count:', count);
    doSomethingWith(count);
  });

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* Child won't re-render when count changes */}
      <ExpensiveChild onClick={handleClick} />
    </>
  );
}

const ExpensiveChild = memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

**Benefits:**
- Prevents unnecessary child re-renders
- No dependency array management
- Always accesses latest values

## Comparison

### Debounce vs Throttle

**Debounce:**
- Waits for quiet period
- Executes after last event
- Good for: search, auto-save, form validation

**Throttle:**
- Executes at regular intervals
- Guarantees execution during active period
- Good for: scroll, resize, mouse move

**Example:**

```typescript
// User types "react"

// With debounce (500ms):
// r -> wait 500ms -> (types 'e') -> cancel wait
// re -> wait 500ms -> (types 'a') -> cancel wait
// rea -> wait 500ms -> (types 'c') -> cancel wait
// reac -> wait 500ms -> (types 't') -> cancel wait
// react -> wait 500ms -> EXECUTE (1 API call)

// With throttle (500ms):
// r -> EXECUTE -> wait 500ms
// re -> (within 500ms) -> skip
// rea -> (within 500ms) -> skip
// reac -> (500ms passed) -> EXECUTE
// react -> (within 500ms) -> skip
// (Result: 2 API calls)
```

## Performance Impact

### Before Optimization
```typescript
// Every keystroke triggers API call
const [search, setSearch] = useState('');

useEffect(() => {
  searchAPI(search); // 5 API calls for "react"
}, [search]);
```

### After Optimization (Debounce)
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  searchAPI(debouncedSearch); // 1 API call for "react"
}, [debouncedSearch]);
```

**Savings:**
- 80-95% fewer API calls
- 80-95% less network traffic
- Faster perceived performance

## Best Practices

### 1. Choose Appropriate Delay

```typescript
// Too short (50ms) - minimal benefit
const debouncedShort = useDebounce(value, 50);

// Too long (5000ms) - feels unresponsive
const debouncedLong = useDebounce(value, 5000);

// Just right (300-500ms) - balance of responsiveness and efficiency
const debouncedGood = useDebounce(value, 300);
```

**Recommended delays:**
- Search input: 300-500ms
- Auto-save: 500-1000ms
- Form validation: 300ms
- Scroll/resize: 100-200ms

### 2. Clean Up Side Effects

```typescript
// ❌ Bad: No cleanup
const debouncedCallback = useDebouncedCallback(() => {
  fetchData();
}, 500);

// ✅ Good: Handle cleanup
const debouncedCallback = useDebouncedCallback(() => {
  const controller = new AbortController();
  fetchData(controller.signal);
  return () => controller.abort();
}, 500);
```

### 3. Combine with React Query

```typescript
import { useDebounce } from '@/application/hooks/performance';
import { useQuery } from '@tanstack/react-query';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
    enabled: debouncedSearch.length > 2, // Only search if > 2 chars
  });

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
```

### 4. Use with LocalStorage

```typescript
// Auto-save to localStorage without blocking UI
const [data, setData] = useState(initialData);
const debouncedData = useDebounce(data, 500);

useEffect(() => {
  localStorage.setItem('saved-data', JSON.stringify(debouncedData));
}, [debouncedData]);
```

## Common Pitfalls

### 1. Using Wrong Hook

```typescript
// ❌ Wrong: Using debounce for scroll
const debouncedScroll = useDebounce(scrollY, 100);
// Problem: Won't fire until scrolling stops

// ✅ Correct: Using throttle for scroll
const throttledScroll = useThrottle(handleScroll, 100);
// Fires regularly while scrolling
```

### 2. Forgetting Dependencies

```typescript
// ❌ Wrong: Missing dependencies
const callback = useDebouncedCallback(() => {
  doSomething(externalValue);
}, 500);
// Problem: Uses stale externalValue

// ✅ Correct: Include in closure or use useMemoizedCallback
const callback = useMemoizedCallback(() => {
  doSomething(externalValue);
});
```

### 3. Over-optimization

```typescript
// ❌ Unnecessary: Simple operations
const debouncedCount = useDebounce(count, 500);
// Problem: No performance benefit for simple state updates

// ✅ Only debounce expensive operations
const debouncedSearch = useDebounce(searchTerm, 500);
useEffect(() => {
  expensiveAPICall(debouncedSearch);
}, [debouncedSearch]);
```

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Still old value

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated'); // Now updated
  });
});
```

## Resources

- [Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

## Summary

Performance hooks help optimize React applications by controlling when expensive operations execute:

- **useDebounce**: Wait for quiet period (search, auto-save)
- **useDebouncedCallback**: Debounced event handlers
- **useThrottle**: Rate limit (scroll, resize)
- **useMemoizedCallback**: Stable callbacks with latest values

Use these hooks to:
- Reduce API calls by 90%+
- Prevent UI blocking
- Improve perceived performance
- Optimize resource usage
