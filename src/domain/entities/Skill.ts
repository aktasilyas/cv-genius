import { z } from 'zod';
import { SkillLevelSchema } from '../value-objects/SkillLevel';

// Base schema (allows empty values during editing)
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: SkillLevelSchema,
});

// Validation schema (enforces required fields)
export const SkillValidationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required'),
  level: SkillLevelSchema,
});

export type Skill = z.infer<typeof SkillSchema>;

export const createSkill = (data: Partial<Skill>): Skill => {
  return SkillSchema.parse({
    id: data.id ?? crypto.randomUUID(),
    name: data.name ?? '',
    level: data.level ?? 'intermediate',
  });
};

export const validateSkill = (data: unknown): data is Skill => {
  return SkillSchema.safeParse(data).success;
};

export const updateSkill = (skill: Skill, updates: Partial<Skill>): Skill => {
  return SkillSchema.parse({
    ...skill,
    ...updates,
  });
};
