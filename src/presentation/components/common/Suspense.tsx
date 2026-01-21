import { FC, ReactNode, Suspense as ReactSuspense } from 'react';
import { Loader2 } from 'lucide-react';

interface SuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Default fallback component for Suspense
 * Shows a centered loading spinner
 */
const DefaultFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-accent" />
  </div>
);

/**
 * Suspense Wrapper Component
 * Wraps React.Suspense with a default fallback UI
 * Used for lazy-loaded components and code splitting
 */
export const Suspense: FC<SuspenseProps> = ({ children, fallback }) => (
  <ReactSuspense fallback={fallback ?? <DefaultFallback />}>
    {children}
  </ReactSuspense>
);
