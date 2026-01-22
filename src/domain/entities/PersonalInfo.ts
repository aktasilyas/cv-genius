import { z } from 'zod';

// Base schema for data structure (allows empty values during editing)
export const PersonalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  title: z.string(),
  photo: z.string().optional().or(z.literal('')),
});

// Validation schema for complete CV (enforces required fields)
export const PersonalInfoValidationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  title: z.string().min(1, 'Title is required'),
  photo: z.string().optional().or(z.literal('')),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

export const createPersonalInfo = (data: Partial<PersonalInfo>): PersonalInfo => {
  return PersonalInfoSchema.parse({
    fullName: data.fullName ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    location: data.location ?? '',
    linkedin: data.linkedin ?? '',
    website: data.website ?? '',
    title: data.title ?? '',
    photo: data.photo ?? '',
  });
};

export const validatePersonalInfo = (data: unknown): data is PersonalInfo => {
  return PersonalInfoSchema.safeParse(data).success;
};

// Validate for completeness (use before save/submit)
export const validatePersonalInfoComplete = (data: unknown): boolean => {
  return PersonalInfoValidationSchema.safeParse(data).success;
};

export const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  title: '',
  photo: '',
};
