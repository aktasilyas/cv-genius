import { z } from 'zod';
import { CVDataSchema, CVData } from './CVData';

export const CVVersionSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  label: z.string().min(1, 'Version label is required'),
  data: CVDataSchema,
});

export type CVVersion = z.infer<typeof CVVersionSchema>;

export const createCVVersion = (data: CVData, label?: string): CVVersion => {
  return CVVersionSchema.parse({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    label: label ?? `Version ${new Date().toLocaleString()}`,
    data,
  });
};

export const validateCVVersion = (data: unknown): data is CVVersion => {
  return CVVersionSchema.safeParse(data).success;
};

export const compareCVVersions = (v1: CVVersion, v2: CVVersion): number => {
  return v1.timestamp.getTime() - v2.timestamp.getTime();
};
