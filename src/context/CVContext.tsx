/**
 * @deprecated Use individual contexts from '@/application' or the useCV hook instead
 * This file is kept for backwards compatibility
 */

import { ReactNode } from 'react';
import { AppProviders } from '@/application/providers/AppProviders';
import { useCV } from '@/application/hooks/useCV';

/**
 * @deprecated Use AppProviders from '@/application' instead
 */
export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AppProviders>{children}</AppProviders>;
};

/**
 * @deprecated Use useCV from '@/application/hooks/useCV' instead
 */
export const useCVContext = () => {
  return useCV();
};
