import { describe, it, expect } from 'vitest';
import { ExperienceSchema, createExperience } from '@/domain/entities/Experience';

describe('Experience Entity', () => {
  describe('ExperienceSchema', () => {
    it('should validate correct experience data', () => {
      const validData = {
        id: '123',
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: '2023-01',
        current: false,
        description: 'Built features and improved performance',
        achievements: ['Increased performance by 50%', 'Led team of 5'],
      };

      const result = ExperienceSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.company).toBe('Tech Corp');
        expect(result.data.achievements).toHaveLength(2);
      }
    });

    it('should reject empty company name', () => {
      const invalidData = {
        id: '123',
        company: '',
        position: 'Developer',
        startDate: '2020-01',
        endDate: '2023-01',
        current: false,
        description: '',
        achievements: [],
      };

      const result = ExperienceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty position', () => {
      const invalidData = {
        id: '123',
        company: 'Tech Corp',
        position: '',
        startDate: '2020-01',
        endDate: null,
        current: true,
        description: '',
        achievements: [],
      };

      const result = ExperienceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow null endDate for current position', () => {
      const validData = {
        id: '123',
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2020-01',
        endDate: null,
        current: true,
        description: 'Currently working here',
        achievements: [],
      };

      const result = ExperienceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('createExperience', () => {
    it('should create experience with defaults', () => {
      const experience = createExperience({
        company: 'Test Corp',
        position: 'Developer',
      });

      expect(experience.company).toBe('Test Corp');
      expect(experience.position).toBe('Developer');
      expect(experience.id).toBeDefined();
      expect(experience.current).toBe(false);
      expect(experience.achievements).toEqual([]);
      expect(experience.description).toBe('');
    });

    it('should generate unique ids', () => {
      const exp1 = createExperience({ company: 'A', position: 'B' });
      const exp2 = createExperience({ company: 'A', position: 'B' });

      expect(exp1.id).not.toBe(exp2.id);
    });

    it('should preserve provided id', () => {
      const experience = createExperience({
        id: 'custom-id',
        company: 'Test',
        position: 'Dev',
      });

      expect(experience.id).toBe('custom-id');
    });

    it('should set current to true when endDate is null', () => {
      const experience = createExperience({
        company: 'Test',
        position: 'Dev',
        startDate: '2020-01',
        endDate: null,
        current: true,
      });

      expect(experience.current).toBe(true);
      expect(experience.endDate).toBeNull();
    });
  });
});
