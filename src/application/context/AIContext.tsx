import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { AIFeedback, CVScore, JobMatch } from '@/domain';

interface AIContextType {
  aiFeedback: AIFeedback[];
  setAIFeedback: React.Dispatch<React.SetStateAction<AIFeedback[]>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  cvScore: CVScore | null;
  setCVScore: React.Dispatch<React.SetStateAction<CVScore | null>>;
  jobMatch: JobMatch | null;
  setJobMatch: React.Dispatch<React.SetStateAction<JobMatch | null>>;
  clearAIData: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiFeedback, setAIFeedback] = useState<AIFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvScore, setCVScore] = useState<CVScore | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);

  const clearAIData = () => {
    setAIFeedback([]);
    setCVScore(null);
    setJobMatch(null);
    setIsAnalyzing(false);
  };

  const value = useMemo(() => ({
    aiFeedback,
    setAIFeedback,
    isAnalyzing,
    setIsAnalyzing,
    cvScore,
    setCVScore,
    jobMatch,
    setJobMatch,
    clearAIData
  }), [aiFeedback, isAnalyzing, cvScore, jobMatch]);

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};
