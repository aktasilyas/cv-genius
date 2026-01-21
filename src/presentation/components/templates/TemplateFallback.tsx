import { FC } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Template Loading Fallback
 * Displayed while template component is being loaded
 */
export const TemplateFallback: FC = () => (
  <div className="min-h-[1123px] w-full flex items-center justify-center bg-white shadow-lg rounded-lg">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-accent" />
      <p className="text-sm text-muted-foreground">Loading template...</p>
    </div>
  </div>
);
