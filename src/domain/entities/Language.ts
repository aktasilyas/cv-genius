import { z } from 'zod';
import { LanguageProficiencySchema } from '../value-objects/LanguageProficiency';

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Language name is required'),
  proficiency: LanguageProficiencySchema,
});

export type Language = z.infer<typeof LanguageSchema>;

export const createLanguage = (data: Partial<Language>): Language => {
  return LanguageSchema.parse({
    id: data.id ?? crypto.randomUUID(),
    name: data.name ?? '',
    proficiency: data.proficiency ?? 'conversational',
  });
};

export const validateLanguage = (data: unknown): data is Language => {
  return LanguageSchema.safeParse(data).success;
};

export const updateLanguage = (language: Language, updates: Partial<Language>): Language => {
  return LanguageSchema.parse({
    ...language,
    ...updates,
  });
};
