import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CVData, initialCVData, CVDataSchema } from '@/domain';
import { useDebounce } from '@/application/hooks/performance';

interface CVDataContextType {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const CVDataContext = createContext<CVDataContextType | undefined>(undefined);

export const CVDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv-data');
    if (saved) {
      try {
        const parsed = CVDataSchema.safeParse(JSON.parse(saved));
        return parsed.success ? parsed.data : initialCVData;
      } catch {
        return initialCVData;
      }
    }
    return initialCVData;
  });

  // Debounce CV data to avoid excessive localStorage writes
  // Only save to localStorage after 500ms of inactivity
  const debouncedCVData = useDebounce(cvData, 500);

  useEffect(() => {
    localStorage.setItem('cv-data', JSON.stringify(debouncedCVData));
  }, [debouncedCVData]);

  const value = useMemo(() => ({ cvData, setCVData }), [cvData]);

  return (
    <CVDataContext.Provider value={value}>
      {children}
    </CVDataContext.Provider>
  );
};

export const useCVData = () => {
  const context = useContext(CVDataContext);
  if (!context) {
    throw new Error('useCVData must be used within CVDataProvider');
  }
  return context;
};
