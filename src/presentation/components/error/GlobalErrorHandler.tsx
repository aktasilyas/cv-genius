import { FC, ReactNode, useEffect } from 'react';
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';

interface GlobalErrorHandlerProps {
  children: ReactNode;
}

/**
 * Global Error Handler Component
 * Catches unhandled promise rejections and global errors
 */
export const GlobalErrorHandler: FC<GlobalErrorHandlerProps> = ({ children }) => {
  const { handleError } = useErrorHandler();

  useEffect(() => {
    /**
     * Handle unhandled promise rejections
     */
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      handleError(event.reason, {
        redirectOnAuth: false,
        context: { type: 'Unhandled Promise Rejection' }
      });
    };

    /**
     * Handle global errors
     */
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      handleError(event.error, {
        redirectOnAuth: false,
        context: {
          type: 'Global Error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      });
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [handleError]);

  return <>{children}</>;
};
