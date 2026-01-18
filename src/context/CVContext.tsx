import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CVData, 
  AIFeedback, 
  CVTemplate, 
  CVVersion, 
  CVScore, 
  JobMatch,
  CVCreationMode,
  initialCVData,
  Certificate,
  SectionOrder,
  defaultSectionOrder,
  defaultSectionVisibility
} from '@/types/cv';

interface CVContextType {
  // CV Data
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
  
  // Personal Info
  updatePersonalInfo: (field: keyof CVData['personalInfo'], value: string) => void;
  updateSummary: (value: string) => void;
  
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: any) => void;
  removeExperience: (id: string) => void;
  
  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: any) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: any) => void;
  removeSkill: (id: string) => void;
  
  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: any) => void;
  removeLanguage: (id: string) => void;
  
  // Certificates
  addCertificate: () => void;
  updateCertificate: (id: string, field: string, value: any) => void;
  removeCertificate: (id: string) => void;
  
  // Section Controls
  toggleSectionVisibility: (section: keyof CVData['sectionVisibility']) => void;
  updateSectionOrder: (newOrder: SectionOrder[]) => void;
  
  // Navigation
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  
  // Template
  selectedTemplate: CVTemplate;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<CVTemplate>>;
  
  // AI Features
  aiFeedback: AIFeedback[];
  setAIFeedback: React.Dispatch<React.SetStateAction<AIFeedback[]>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  cvScore: CVScore | null;
  setCVScore: React.Dispatch<React.SetStateAction<CVScore | null>>;
  jobMatch: JobMatch | null;
  setJobMatch: React.Dispatch<React.SetStateAction<JobMatch | null>>;
  
  // Version History
  versions: CVVersion[];
  saveVersion: (label: string) => void;
  restoreVersion: (id: string) => void;
  
  // Creation Mode
  creationMode: CVCreationMode;
  setCreationMode: React.Dispatch<React.SetStateAction<CVCreationMode>>;
  
  // AI Text Input
  aiTextInput: string;
  setAITextInput: React.Dispatch<React.SetStateAction<string>>;
  isParsingText: boolean;
  setIsParsingText: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Reset
  resetCV: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv-data');
    return saved ? JSON.parse(saved) : initialCVData;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');
  const [aiFeedback, setAIFeedback] = useState<AIFeedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvScore, setCVScore] = useState<CVScore | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [creationMode, setCreationMode] = useState<CVCreationMode>('structured');
  const [aiTextInput, setAITextInput] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cv-data', JSON.stringify(cvData));
  }, [cvData]);

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

  // Experience
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

  // Education
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

  // Skills
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

  // Languages
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

  // Certificates
  const addCertificate = () => {
    setCVData(prev => ({
      ...prev,
      certificates: [...(prev.certificates || []), {
        id: generateId(),
        name: '',
        issuer: '',
        date: '',
        url: ''
      }]
    }));
  };

  const updateCertificate = (id: string, field: string, value: any) => {
    setCVData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertificate = (id: string) => {
    setCVData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).filter(cert => cert.id !== id)
    }));
  };

  // Section Visibility
  const toggleSectionVisibility = (section: keyof CVData['sectionVisibility']) => {
    setCVData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
  };

  // Section Order
  const updateSectionOrder = (newOrder: SectionOrder[]) => {
    setCVData(prev => ({
      ...prev,
      sectionOrder: newOrder
    }));
  };

  // Version History
  const saveVersion = (label: string) => {
    const newVersion: CVVersion = {
      id: generateId(),
      timestamp: new Date(),
      label,
      data: { ...cvData }
    };
    setVersions(prev => [newVersion, ...prev].slice(0, 10)); // Keep last 10 versions
  };

  const restoreVersion = (id: string) => {
    const version = versions.find(v => v.id === id);
    if (version) {
      setCVData(version.data);
    }
  };

  // Reset CV
  const resetCV = () => {
    setCVData(initialCVData);
    setAIFeedback([]);
    setCVScore(null);
    setJobMatch(null);
    setCurrentStep(0);
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
      addCertificate,
      updateCertificate,
      removeCertificate,
      toggleSectionVisibility,
      updateSectionOrder,
      currentStep,
      setCurrentStep,
      selectedTemplate,
      setSelectedTemplate,
      aiFeedback,
      setAIFeedback,
      isAnalyzing,
      setIsAnalyzing,
      cvScore,
      setCVScore,
      jobMatch,
      setJobMatch,
      versions,
      saveVersion,
      restoreVersion,
      creationMode,
      setCreationMode,
      aiTextInput,
      setAITextInput,
      isParsingText,
      setIsParsingText,
      resetCV
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
