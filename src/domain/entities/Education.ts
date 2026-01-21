import { z } from 'zod';

// Base schema (allows empty values during editing)
export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
  achievements: z.array(z.string()),
});

// Validation schema (enforces required fields)
export const EducationValidationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  gpa: z.string().optional(),
  achievements: z.array(z.string()),
}).refine((data) => {
  if (!data.endDate) return true;
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type Education = z.infer<typeof EducationSchema>;

export const createEducation = (data: Partial<Education>): Education => {
  return EducationSchema.parse({
    id: data.id ?? crypto.randomUUID(),
    institution: data.institution ?? '',
    degree: data.degree ?? '',
    field: data.field ?? '',
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? '',
    gpa: data.gpa ?? '',
    achievements: data.achievements ?? [],
  });
};

export const validateEducation = (data: unknown): data is Education => {
  return EducationSchema.safeParse(data).success;
};

export const updateEducation = (education: Education, updates: Partial<Education>): Education => {
  return EducationSchema.parse({
    ...education,
    ...updates,
  });
};
