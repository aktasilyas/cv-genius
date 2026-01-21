import { describe, it, expect } from 'vitest';
import { CVDataSchema, initialCVData } from '@/domain/entities/CVData';
import { createExperience } from '@/domain/entities/Experience';
import { createEducation } from '@/domain/entities/Education';

describe('CVData Entity', () => {
  describe('CVDataSchema', () => {
    it('should validate initial CV data', () => {
      const result = CVDataSchema.safeParse(initialCVData);
      expect(result.success).toBe(true);
    });

    it('should validate CV data with experience and education', () => {
      const cvData = {
        ...initialCVData,
        experience: [
          createExperience({ company: 'Google', position: 'Engineer' }),
          createExperience({ company: 'Microsoft', position: 'Developer' }),
        ],
        education: [
          createEducation({ institution: 'MIT', degree: 'BS', field: 'CS' }),
        ],
      };

      const result = CVDataSchema.safeParse(cvData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.experience).toHaveLength(2);
        expect(result.data.education).toHaveLength(1);
      }
    });

    it('should reject invalid personal info', () => {
      const invalidData = {
        ...initialCVData,
        personalInfo: {
          fullName: '',
          email: 'invalid-email',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
      };

      const result = CVDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate section visibility', () => {
      const cvData = {
        ...initialCVData,
        sectionVisibility: {
          summary: true,
          experience: true,
          education: true,
          skills: false,
          languages: false,
          certificates: false,
        },
      };

      const result = CVDataSchema.safeParse(cvData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sectionVisibility.skills).toBe(false);
      }
    });

    it('should validate section order', () => {
      const cvData = {
        ...initialCVData,
        sectionOrder: [
          { id: 'summary', order: 0 },
          { id: 'experience', order: 1 },
          { id: 'education', order: 2 },
        ],
      };

      const result = CVDataSchema.safeParse(cvData);
      expect(result.success).toBe(true);
    });
  });

  describe('initialCVData', () => {
    it('should have all required sections', () => {
      expect(initialCVData.personalInfo).toBeDefined();
      expect(initialCVData.summary).toBeDefined();
      expect(initialCVData.experience).toBeInstanceOf(Array);
      expect(initialCVData.education).toBeInstanceOf(Array);
      expect(initialCVData.skills).toBeInstanceOf(Array);
      expect(initialCVData.languages).toBeInstanceOf(Array);
      expect(initialCVData.certificates).toBeInstanceOf(Array);
    });

    it('should have valid section visibility', () => {
      expect(initialCVData.sectionVisibility).toBeDefined();
      expect(typeof initialCVData.sectionVisibility.summary).toBe('boolean');
    });

    it('should have valid section order', () => {
      expect(initialCVData.sectionOrder).toBeInstanceOf(Array);
      expect(initialCVData.sectionOrder.length).toBeGreaterThan(0);
    });
  });
});
