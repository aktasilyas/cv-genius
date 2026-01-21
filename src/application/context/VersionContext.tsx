import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { CVVersion, createCVVersion, CVData } from '@/domain';
import { useCVData } from './CVDataContext';

interface VersionContextType {
  versions: CVVersion[];
  saveVersion: (label: string) => void;
  restoreVersion: (id: string) => void;
  clearVersions: () => void;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const VersionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { cvData, setCVData } = useCVData();
  const [versions, setVersions] = useState<CVVersion[]>([]);

  const saveVersion = useCallback((label: string) => {
    const newVersion = createCVVersion(cvData, label);
    setVersions(prev => [newVersion, ...prev].slice(0, 10)); // Keep last 10 versions
  }, [cvData]);

  const restoreVersion = useCallback((id: string) => {
    const version = versions.find(v => v.id === id);
    if (version) {
      setCVData(version.data);
    }
  }, [versions, setCVData]);

  const clearVersions = useCallback(() => {
    setVersions([]);
  }, []);

  const value = useMemo(() => ({
    versions,
    saveVersion,
    restoreVersion,
    clearVersions
  }), [versions, saveVersion, restoreVersion, clearVersions]);

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersion must be used within VersionProvider');
  }
  return context;
};
