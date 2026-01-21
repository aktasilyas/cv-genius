import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
} from '@/application/errors/AppError';
import { errorLogger } from '@/application/errors/errorLogger';
import { getErrorMessage } from '@/application/errors/errorMessages';

interface ErrorHandlerOptions {
  showToast?: boolean;
  redirectOnAuth?: boolean;
  logError?: boolean;
  context?: Record<string, unknown>;
}

/**
 * Hook for centralized error handling
 * Handles different error types with appropriate UI feedback and logging
 */
export const useErrorHandler = () => {
  // Use navigate safely - it might not be available outside Router context
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    navigate = useNavigate();
  } catch (error) {
    // Router context not available, navigation will be disabled
    console.warn('useErrorHandler: Router context not available, navigation disabled');
  }

  // TODO: Get language from settings context when available
  const language = 'en'; // Default language

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      redirectOnAuth = true,
      logError = true,
      context
    } = options;

    // Log error
    if (logError && error instanceof Error) {
      errorLogger.log(error, context);
    }

    // Handle AuthenticationError
    if (error instanceof AuthenticationError) {
      if (showToast) {
        toast.error(getErrorMessage('AUTH_ERROR', language));
      }
      if (redirectOnAuth && navigate) {
        navigate('/login');
      }
      return;
    }

    // Handle AuthorizationError
    if (error instanceof AuthorizationError) {
      if (showToast) {
        toast.error(getErrorMessage('AUTHORIZATION_ERROR', language));
      }
      return;
    }

    // Handle ValidationError
    if (error instanceof ValidationError) {
      if (showToast) {
        if (error.fields && Object.keys(error.fields).length > 0) {
          // Show field-specific errors
          Object.entries(error.fields).forEach(([field, message]) => {
            toast.error(`${field}: ${message}`);
          });
        } else {
          toast.error(error.message || getErrorMessage('VALIDATION_ERROR', language));
        }
      }
      return;
    }

    // Handle NotFoundError
    if (error instanceof NotFoundError) {
      if (showToast) {
        toast.error(error.message || getErrorMessage('NOT_FOUND', language));
      }
      return;
    }

    // Handle ConflictError
    if (error instanceof ConflictError) {
      if (showToast) {
        toast.error(error.message || getErrorMessage('CONFLICT_ERROR', language));
      }
      return;
    }

    // Handle RateLimitError
    if (error instanceof RateLimitError) {
      if (showToast) {
        toast.error(error.message || getErrorMessage('RATE_LIMIT_ERROR', language));
      }
      return;
    }

    // Handle generic AppError
    if (error instanceof AppError) {
      if (showToast) {
        toast.error(getErrorMessage(error.code, language));
      }
      return;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (showToast) {
        toast.error(getErrorMessage('NETWORK_ERROR', language));
      }
      return;
    }

    // Handle unknown errors
    if (showToast) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || getErrorMessage('UNKNOWN_ERROR', language));
    }
  }, [language, navigate]);

  /**
   * Handle error with custom message
   */
  const handleErrorWithMessage = useCallback((
    error: unknown,
    customMessage: string,
    options: Omit<ErrorHandlerOptions, 'showToast'> = {}
  ) => {
    if (options.logError !== false && error instanceof Error) {
      errorLogger.log(error, options.context);
    }
    toast.error(customMessage);
  }, []);

  return {
    handleError,
    handleErrorWithMessage
  };
};
