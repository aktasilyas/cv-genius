import { z } from 'zod';

export const SkillLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

export type SkillLevel = z.infer<typeof SkillLevelSchema>;

export const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

export const getSkillLevelLabel = (level: SkillLevel): string => {
  const labels: Record<SkillLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };
  return labels[level];
};
