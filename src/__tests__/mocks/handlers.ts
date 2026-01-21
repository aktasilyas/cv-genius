import { vi } from 'vitest';

/**
 * Mock Handlers for MSW (Mock Service Worker)
 * Use these for integration tests that need to mock network requests
 */

/**
 * Mock localStorage
 */
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
};

/**
 * Mock window.crypto.randomUUID
 */
export const mockRandomUUID = () => {
  let counter = 0;
  return vi.fn(() => `mock-uuid-${++counter}`);
};

/**
 * Mock setTimeout/setInterval for testing debounce/throttle
 */
export const mockTimers = () => {
  vi.useFakeTimers();
  return {
    runAllTimers: () => vi.runAllTimers(),
    runOnlyPendingTimers: () => vi.runOnlyPendingTimers(),
    advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
    clearAllTimers: () => vi.clearAllTimers(),
    useRealTimers: () => vi.useRealTimers(),
  };
};

/**
 * Mock file reader for testing file uploads
 */
export const createMockFileReader = (result: string) => {
  return class MockFileReader {
    onload: ((event: any) => void) | null = null;
    onerror: ((event: any) => void) | null = null;
    result: string | null = null;

    readAsText() {
      setTimeout(() => {
        this.result = result;
        if (this.onload) {
          this.onload({ target: { result } });
        }
      }, 0);
    }

    readAsDataURL() {
      setTimeout(() => {
        this.result = `data:text/plain;base64,${btoa(result)}`;
        if (this.onload) {
          this.onload({ target: { result: this.result } });
        }
      }, 0);
    }
  };
};
