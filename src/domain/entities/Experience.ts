import { z } from 'zod';

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
  achievements: z.array(z.string()),
}).refine((data) => {
  if (data.current) return true;
  if (!data.endDate) return false;
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const createExperience = (data: Partial<Experience>): Experience => {
  return ExperienceSchema.parse({
    id: data.id ?? crypto.randomUUID(),
    company: data.company ?? '',
    position: data.position ?? '',
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? '',
    current: data.current ?? false,
    description: data.description ?? '',
    achievements: data.achievements ?? [],
  });
};

export const validateExperience = (data: unknown): data is Experience => {
  return ExperienceSchema.safeParse(data).success;
};

export const updateExperience = (experience: Experience, updates: Partial<Experience>): Experience => {
  return ExperienceSchema.parse({
    ...experience,
    ...updates,
  });
};
