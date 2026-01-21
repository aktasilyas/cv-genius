import { z } from 'zod';
import { PersonalInfoSchema, defaultPersonalInfo } from './PersonalInfo';
import { ExperienceSchema } from './Experience';
import { EducationSchema } from './Education';
import { SkillSchema } from './Skill';
import { LanguageSchema } from './Language';
import { CertificateSchema } from './Certificate';

// Section Visibility
export const SectionVisibilitySchema = z.object({
  personalInfo: z.boolean(),
  summary: z.boolean(),
  experience: z.boolean(),
  education: z.boolean(),
  skills: z.boolean(),
  languages: z.boolean(),
  certificates: z.boolean(),
});

export type SectionVisibility = z.infer<typeof SectionVisibilitySchema>;

export const defaultSectionVisibility: SectionVisibility = {
  personalInfo: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  languages: true,
  certificates: true,
};

// Section Order
export const SectionOrderSchema = z.object({
  id: z.enum(['summary', 'experience', 'education', 'skills', 'languages', 'certificates']),
  order: z.number(),
});

export type SectionOrder = z.infer<typeof SectionOrderSchema>;

export const defaultSectionOrder: SectionOrder[] = [
  { id: 'summary', order: 0 },
  { id: 'experience', order: 1 },
  { id: 'education', order: 2 },
  { id: 'skills', order: 3 },
  { id: 'languages', order: 4 },
  { id: 'certificates', order: 5 },
];

// CVData Aggregate Root
export const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string(),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  languages: z.array(LanguageSchema),
  certificates: z.array(CertificateSchema),
  sectionVisibility: SectionVisibilitySchema,
  sectionOrder: z.array(SectionOrderSchema),
});

export type CVData = z.infer<typeof CVDataSchema>;

export const createCVData = (data?: Partial<CVData>): CVData => {
  return CVDataSchema.parse({
    personalInfo: data?.personalInfo ?? defaultPersonalInfo,
    summary: data?.summary ?? '',
    experience: data?.experience ?? [],
    education: data?.education ?? [],
    skills: data?.skills ?? [],
    languages: data?.languages ?? [],
    certificates: data?.certificates ?? [],
    sectionVisibility: data?.sectionVisibility ?? defaultSectionVisibility,
    sectionOrder: data?.sectionOrder ?? defaultSectionOrder,
  });
};

export const validateCVData = (data: unknown): data is CVData => {
  return CVDataSchema.safeParse(data).success;
};

export const initialCVData: CVData = createCVData();

// Helper functions for managing sections
export const toggleSectionVisibility = (
  cvData: CVData,
  section: keyof SectionVisibility
): CVData => {
  return {
    ...cvData,
    sectionVisibility: {
      ...cvData.sectionVisibility,
      [section]: !cvData.sectionVisibility[section],
    },
  };
};

export const updateSectionOrder = (
  cvData: CVData,
  newOrder: SectionOrder[]
): CVData => {
  return {
    ...cvData,
    sectionOrder: newOrder,
  };
};

export const isComplete = (cvData: CVData): boolean => {
  const hasPersonalInfo = cvData.personalInfo.fullName &&
                          cvData.personalInfo.email &&
                          cvData.personalInfo.phone;
  const hasSummary = cvData.summary.length > 0;
  const hasExperience = cvData.experience.length > 0;
  const hasEducation = cvData.education.length > 0;

  return !!(hasPersonalInfo && hasSummary && hasExperience && hasEducation);
};
