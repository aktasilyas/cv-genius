import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CVData, AIFeedback, CVTemplate, initialCVData } from '@/types/cv';

interface CVContextType {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
  updatePersonalInfo: (field: keyof CVData['personalInfo'], value: string) => void;
  updateSummary: (value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: any) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: any) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: any) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: any) => void;
  removeLanguage: (id: string) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  selectedTemplate: CVTemplate;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<CVTemplate>>;
  aiFeedback: AIFeedback[];
  setAIFeedback: React.Dispatch<React.SetStateAction<AIFeedback[]>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');
  const [aiFeedback, setAIFeedback] = useState<AIFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value: string) => {
    setCVData(prev => ({ ...prev, summary: value }));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addExperience = () => {
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: generateId(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }]
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: generateId(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: []
      }]
    }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        id: generateId(),
        name: '',
        level: 'intermediate'
      }]
    }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addLanguage = () => {
    setCVData(prev => ({
      ...prev,
      languages: [...prev.languages, {
        id: generateId(),
        name: '',
        proficiency: 'conversational'
      }]
    }));
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  return (
    <CVContext.Provider value={{
      cvData,
      setCVData,
      updatePersonalInfo,
      updateSummary,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addSkill,
      updateSkill,
      removeSkill,
      addLanguage,
      updateLanguage,
      removeLanguage,
      currentStep,
      setCurrentStep,
      selectedTemplate,
      setSelectedTemplate,
      aiFeedback,
      setAIFeedback,
      isAnalyzing,
      setIsAnalyzing
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};
