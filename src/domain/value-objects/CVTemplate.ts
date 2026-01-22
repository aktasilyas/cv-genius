import { z } from 'zod';

export const CVTemplateTypeSchema = z.enum([
  // Existing templates
  'modern',
  'classic',
  'minimal',
  'creative',
  'executive',
  'technical',
  // New sectoral templates
  'berlin',
  'manhattan',
  'stockholm',
  'tokyo',
  'dublin',
]);

export type CVTemplateType = z.infer<typeof CVTemplateTypeSchema>;

export const CV_TEMPLATES: CVTemplateType[] = [
  'modern',
  'classic',
  'minimal',
  'creative',
  'executive',
  'technical',
  'berlin',
  'manhattan',
  'stockholm',
  'tokyo',
  'dublin',
];

export const getTemplateLabel = (template: CVTemplateType): string => {
  const labels: Record<CVTemplateType, string> = {
    modern: 'Modern',
    classic: 'Classic',
    minimal: 'Minimal',
    creative: 'Creative',
    executive: 'Executive',
    technical: 'Technical',
    berlin: 'Berlin',
    manhattan: 'Manhattan',
    stockholm: 'Stockholm',
    tokyo: 'Tokyo',
    dublin: 'Dublin',
  };
  return labels[template];
};

// Template categories for filtering
export type TemplateCategory = 'all' | 'professional' | 'creative' | 'academic' | 'entry-level';

export const getTemplateCategory = (template: CVTemplateType): TemplateCategory => {
  const categories: Record<CVTemplateType, TemplateCategory> = {
    modern: 'professional',
    classic: 'professional',
    minimal: 'creative',
    creative: 'creative',
    executive: 'professional',
    technical: 'professional',
    berlin: 'professional',
    manhattan: 'professional',
    stockholm: 'creative',
    tokyo: 'academic',
    dublin: 'entry-level',
  };
  return categories[template];
};
