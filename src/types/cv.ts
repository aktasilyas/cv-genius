export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  title: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface SectionVisibility {
  personalInfo: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  languages: boolean;
  certificates: boolean;
}

export interface SectionOrder {
  id: keyof Omit<SectionVisibility, 'personalInfo'>;
  order: number;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  sectionVisibility: SectionVisibility;
  sectionOrder: SectionOrder[];
}

export interface AIFeedback {
  id: string;
  section: keyof CVData;
  type: 'warning' | 'suggestion' | 'improvement';
  message: string;
  suggestion?: string;
  explanation?: string;
  improvedText?: string;
  applied?: boolean;
}

export interface CVScore {
  overall: number;
  breakdown: {
    completeness: number;
    quality: number;
    atsCompatibility: number;
    impact: number;
  };
  recommendations: string[];
}

export interface CVVersion {
  id: string;
  timestamp: Date;
  label: string;
  data: CVData;
}

export interface JobMatch {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export type CVTemplate = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'technical';

export type CVCreationMode = 'structured' | 'ai-text' | 'linkedin';

export const defaultSectionOrder: SectionOrder[] = [
  { id: 'summary', order: 0 },
  { id: 'experience', order: 1 },
  { id: 'education', order: 2 },
  { id: 'skills', order: 3 },
  { id: 'languages', order: 4 },
  { id: 'certificates', order: 5 },
];

export const defaultSectionVisibility: SectionVisibility = {
  personalInfo: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  languages: true,
  certificates: true,
};

export const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  sectionVisibility: defaultSectionVisibility,
  sectionOrder: defaultSectionOrder,
};
