import { FC } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
        </div>

        {import.meta.env.DEV && (
          <div className="text-left">
            <details className="text-sm bg-muted p-4 rounded-lg">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="overflow-auto max-h-48 text-xs">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleGoHome}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button onClick={resetErrorBoundary}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};
