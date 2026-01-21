import { describe, it, expect } from 'vitest';
import { EducationSchema, createEducation } from '@/domain/entities/Education';

describe('Education Entity', () => {
  describe('EducationSchema', () => {
    it('should validate correct education data', () => {
      const validData = {
        id: '123',
        institution: 'MIT',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-06',
        current: false,
        gpa: '3.8',
        description: 'Focused on AI and Machine Learning',
      };

      const result = EducationSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.institution).toBe('MIT');
        expect(result.data.gpa).toBe('3.8');
      }
    });

    it('should reject empty institution', () => {
      const invalidData = {
        id: '123',
        institution: '',
        degree: 'BS',
        field: 'CS',
        startDate: '2016',
        endDate: '2020',
        current: false,
        gpa: '',
        description: '',
      };

      const result = EducationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow optional GPA', () => {
      const validData = {
        id: '123',
        institution: 'MIT',
        degree: 'BS',
        field: 'CS',
        startDate: '2016',
        endDate: '2020',
        current: false,
        gpa: '',
        description: '',
      };

      const result = EducationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('createEducation', () => {
    it('should create education with defaults', () => {
      const education = createEducation({
        institution: 'Stanford',
        degree: 'MS',
        field: 'AI',
      });

      expect(education.institution).toBe('Stanford');
      expect(education.degree).toBe('MS');
      expect(education.field).toBe('AI');
      expect(education.id).toBeDefined();
      expect(education.current).toBe(false);
      expect(education.gpa).toBe('');
    });

    it('should generate unique ids', () => {
      const edu1 = createEducation({ institution: 'A', degree: 'B', field: 'C' });
      const edu2 = createEducation({ institution: 'A', degree: 'B', field: 'C' });

      expect(edu1.id).not.toBe(edu2.id);
    });
  });
});
