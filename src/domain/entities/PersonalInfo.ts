import { z } from 'zod';

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  title: z.string().min(1, 'Title is required'),
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
  });
};

export const validatePersonalInfo = (data: unknown): data is PersonalInfo => {
  return PersonalInfoSchema.safeParse(data).success;
};

export const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  title: '',
};
