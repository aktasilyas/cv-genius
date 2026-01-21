import { useCallback, useRef, useEffect } from 'react';

/**
 * useMemoizedCallback Hook
 * Creates a memoized callback that maintains referential equality
 * but always calls the latest version of the callback
 *
 * Similar to useCallback but doesn't require dependency array
 * Useful when you want a stable callback reference but need access to latest values
 *
 * @param callback - The callback function to memoize
 * @returns Memoized callback function
 */
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef<T>(callback);

  // Update ref to latest callback on every render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Return a memoized function that calls the latest callback
  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
};
