import { z } from 'zod';

export const CVCreationModeSchema = z.enum(['structured', 'ai-text', 'linkedin']);

export type CVCreationMode = z.infer<typeof CVCreationModeSchema>;

export const CV_CREATION_MODES: CVCreationMode[] = ['structured', 'ai-text', 'linkedin'];

export const getCreationModeLabel = (mode: CVCreationMode): string => {
  const labels: Record<CVCreationMode, string> = {
    structured: 'Structured Form',
    'ai-text': 'AI Text Analysis',
    linkedin: 'LinkedIn Import',
  };
  return labels[mode];
};
