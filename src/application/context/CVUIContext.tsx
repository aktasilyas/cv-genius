import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  CVTemplateType,
  CVCreationMode,
  TemplateCustomization,
  defaultTemplateCustomization
} from '@/domain';

interface CVUIContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  selectedTemplate: CVTemplateType;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<CVTemplateType>>;
  templateCustomization: TemplateCustomization;
  setTemplateCustomization: React.Dispatch<React.SetStateAction<TemplateCustomization>>;
  creationMode: CVCreationMode;
  setCreationMode: React.Dispatch<React.SetStateAction<CVCreationMode>>;
  aiTextInput: string;
  setAITextInput: React.Dispatch<React.SetStateAction<string>>;
  isParsingText: boolean;
  setIsParsingText: React.Dispatch<React.SetStateAction<boolean>>;
}

const CVUIContext = createContext<CVUIContextType | undefined>(undefined);

export const CVUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateType>(() => {
    const saved = localStorage.getItem('selected-template');
    return (saved as CVTemplateType) || 'modern';
  });

  const [templateCustomization, setTemplateCustomization] = useState<TemplateCustomization>(() => {
    const saved = localStorage.getItem('template-customization');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultTemplateCustomization;
      }
    }
    return defaultTemplateCustomization;
  });

  const [creationMode, setCreationMode] = useState<CVCreationMode>('structured');
  const [aiTextInput, setAITextInput] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);

  // Save template to localStorage
  useEffect(() => {
    localStorage.setItem('selected-template', selectedTemplate);
  }, [selectedTemplate]);

  // Save template customization to localStorage
  useEffect(() => {
    localStorage.setItem('template-customization', JSON.stringify(templateCustomization));
  }, [templateCustomization]);

  const value = useMemo(() => ({
    currentStep,
    setCurrentStep,
    selectedTemplate,
    setSelectedTemplate,
    templateCustomization,
    setTemplateCustomization,
    creationMode,
    setCreationMode,
    aiTextInput,
    setAITextInput,
    isParsingText,
    setIsParsingText
  }), [
    currentStep,
    selectedTemplate,
    templateCustomization,
    creationMode,
    aiTextInput,
    isParsingText
  ]);

  return (
    <CVUIContext.Provider value={value}>
      {children}
    </CVUIContext.Provider>
  );
};

export const useCVUI = () => {
  const context = useContext(CVUIContext);
  if (!context) {
    throw new Error('useCVUI must be used within CVUIProvider');
  }
  return context;
};
