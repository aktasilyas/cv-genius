import { ReactNode } from 'react';
import { CVDataProvider } from '../context/CVDataContext';
import { CVActionsProvider } from '../context/CVActionsContext';
import { CVUIProvider } from '../context/CVUIContext';
import { AIProvider } from '../context/AIContext';
import { VersionProvider } from '../context/VersionContext';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CVDataProvider>
      <CVActionsProvider>
        <CVUIProvider>
          <AIProvider>
            <VersionProvider>
              {children}
            </VersionProvider>
          </AIProvider>
        </CVUIProvider>
      </CVActionsProvider>
    </CVDataProvider>
  );
};
