import { z } from 'zod';

export const CVTemplateTypeSchema = z.enum(['modern', 'classic', 'minimal', 'creative', 'executive', 'technical']);

export type CVTemplateType = z.infer<typeof CVTemplateTypeSchema>;

export const CV_TEMPLATES: CVTemplateType[] = ['modern', 'classic', 'minimal', 'creative', 'executive', 'technical'];

export const getTemplateLabel = (template: CVTemplateType): string => {
  const labels: Record<CVTemplateType, string> = {
    modern: 'Modern',
    classic: 'Classic',
    minimal: 'Minimal',
    creative: 'Creative',
    executive: 'Executive',
    technical: 'Technical',
  };
  return labels[template];
};
