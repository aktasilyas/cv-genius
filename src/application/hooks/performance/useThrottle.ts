import { useRef, useCallback, useEffect } from 'react';

/**
 * useThrottle Hook
 * Limits the rate at which a function can be called
 * Useful for rate-limiting expensive operations like scroll handlers
 *
 * @param callback - The callback function to throttle
 * @param delay - Minimum delay between calls in milliseconds
 * @returns Throttled callback function
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      if (timeSinceLastCall >= delay) {
        // Enough time has passed, execute immediately
        lastCall.current = now;
        callback(...args);
      } else {
        // Schedule execution for when delay has passed
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    }) as T,
    [callback, delay]
  );
};
