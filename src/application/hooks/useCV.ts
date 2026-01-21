import { useCVData } from '../context/CVDataContext';
import { useCVActions } from '../context/CVActionsContext';
import { useCVUI } from '../context/CVUIContext';
import { useAI } from '../context/AIContext';
import { useVersion } from '../context/VersionContext';

/**
 * Facade hook that combines all CV-related contexts
 * Provides a single interface to access all CV functionality
 */
export const useCV = () => {
  const data = useCVData();
  const actions = useCVActions();
  const ui = useCVUI();
  const ai = useAI();
  const version = useVersion();

  return {
    // CV Data
    ...data,

    // CV Actions
    ...actions,

    // UI State
    ...ui,

    // AI Features
    ...ai,

    // Version History
    ...version
  };
};
