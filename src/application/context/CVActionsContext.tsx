import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import { useCVData } from './CVDataContext';
import {
  createExperience,
  createEducation,
  createSkill,
  createLanguage,
  createCertificate,
  SectionOrder,
  CVData,
  initialCVData
} from '@/domain';

interface CVActionsContextType {
  updatePersonalInfo: (field: keyof CVData['personalInfo'], value: string) => void;
  updateSummary: (value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: unknown) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: unknown) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: unknown) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: unknown) => void;
  removeLanguage: (id: string) => void;
  addCertificate: () => void;
  updateCertificate: (id: string, field: string, value: unknown) => void;
  removeCertificate: (id: string) => void;
  toggleSectionVisibility: (section: keyof CVData['sectionVisibility']) => void;
  updateSectionOrder: (newOrder: SectionOrder[]) => void;
  resetCV: () => void;
}

const CVActionsContext = createContext<CVActionsContextType | undefined>(undefined);

export const CVActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setCVData } = useCVData();

  const updatePersonalInfo = useCallback((field: keyof CVData['personalInfo'], value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  }, [setCVData]);

  const updateSummary = useCallback((value: string) => {
    setCVData(prev => ({ ...prev, summary: value }));
  }, [setCVData]);

  // Experience CRUD
  const addExperience = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, createExperience({})]
    }));
  }, [setCVData]);

  const updateExperience = useCallback((id: string, field: string, value: unknown) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  }, [setCVData]);

  const removeExperience = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  }, [setCVData]);

  // Education CRUD
  const addEducation = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, createEducation({})]
    }));
  }, [setCVData]);

  const updateEducation = useCallback((id: string, field: string, value: unknown) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  }, [setCVData]);

  const removeEducation = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  }, [setCVData]);

  // Skill CRUD
  const addSkill = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, createSkill({})]
    }));
  }, [setCVData]);

  const updateSkill = useCallback((id: string, field: string, value: unknown) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  }, [setCVData]);

  const removeSkill = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  }, [setCVData]);

  // Language CRUD
  const addLanguage = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      languages: [...prev.languages, createLanguage({})]
    }));
  }, [setCVData]);

  const updateLanguage = useCallback((id: string, field: string, value: unknown) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  }, [setCVData]);

  const removeLanguage = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  }, [setCVData]);

  // Certificate CRUD
  const addCertificate = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      certificates: [...prev.certificates, createCertificate({})]
    }));
  }, [setCVData]);

  const updateCertificate = useCallback((id: string, field: string, value: unknown) => {
    setCVData(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  }, [setCVData]);

  const removeCertificate = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }));
  }, [setCVData]);

  // Section Controls
  const toggleSectionVisibility = useCallback((section: keyof CVData['sectionVisibility']) => {
    setCVData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
  }, [setCVData]);

  const updateSectionOrder = useCallback((newOrder: SectionOrder[]) => {
    setCVData(prev => ({
      ...prev,
      sectionOrder: newOrder
    }));
  }, [setCVData]);

  const resetCV = useCallback(() => {
    setCVData(initialCVData);
  }, [setCVData]);

  const value = useMemo(() => ({
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
    resetCV
  }), [
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
    resetCV
  ]);

  return (
    <CVActionsContext.Provider value={value}>
      {children}
    </CVActionsContext.Provider>
  );
};

export const useCVActions = () => {
  const context = useContext(CVActionsContext);
  if (!context) {
    throw new Error('useCVActions must be used within CVActionsProvider');
  }
  return context;
};
