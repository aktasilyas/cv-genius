import { describe, it, expect } from 'vitest';
import { SkillLevelSchema, SKILL_LEVELS } from '@/domain/value-objects/SkillLevel';

describe('SkillLevel Value Object', () => {
  describe('SkillLevelSchema', () => {
    it('should validate all valid skill levels', () => {
      SKILL_LEVELS.forEach(level => {
        const result = SkillLevelSchema.safeParse(level);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid skill level', () => {
      const result = SkillLevelSchema.safeParse('invalid-level');
      expect(result.success).toBe(false);
    });

    it('should accept beginner level', () => {
      const result = SkillLevelSchema.safeParse('beginner');
      expect(result.success).toBe(true);
    });

    it('should accept intermediate level', () => {
      const result = SkillLevelSchema.safeParse('intermediate');
      expect(result.success).toBe(true);
    });

    it('should accept advanced level', () => {
      const result = SkillLevelSchema.safeParse('advanced');
      expect(result.success).toBe(true);
    });

    it('should accept expert level', () => {
      const result = SkillLevelSchema.safeParse('expert');
      expect(result.success).toBe(true);
    });
  });

  describe('SKILL_LEVELS constant', () => {
    it('should have all four levels', () => {
      expect(SKILL_LEVELS).toHaveLength(4);
      expect(SKILL_LEVELS).toContain('beginner');
      expect(SKILL_LEVELS).toContain('intermediate');
      expect(SKILL_LEVELS).toContain('advanced');
      expect(SKILL_LEVELS).toContain('expert');
    });
  });
});
