import { z } from 'zod';

export const LanguageProficiencySchema = z.enum(['basic', 'conversational', 'professional', 'native']);

export type LanguageProficiency = z.infer<typeof LanguageProficiencySchema>;

export const LANGUAGE_PROFICIENCIES: LanguageProficiency[] = ['basic', 'conversational', 'professional', 'native'];

export const getLanguageProficiencyLabel = (proficiency: LanguageProficiency): string => {
  const labels: Record<LanguageProficiency, string> = {
    basic: 'Basic',
    conversational: 'Conversational',
    professional: 'Professional',
    native: 'Native',
  };
  return labels[proficiency];
};
