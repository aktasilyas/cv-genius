import { vi } from 'vitest';
import { ICVRepository } from '@/domain/interfaces/ICVRepository';
import { IAuthRepository } from '@/domain/interfaces/IAuthRepository';
import { IAIRepository } from '@/domain/interfaces/IAIRepository';
import { SavedCV } from '@/domain/entities/CVData';
import { initialCVData } from '@/domain/entities/CVData';

/**
 * Mock Data
 */

export const mockSavedCV: SavedCV = {
  id: 'test-cv-1',
  userId: 'user-1',
  title: 'Test CV',
  cvData: initialCVData,
  selectedTemplate: 'modern',
  isDefault: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01'),
};

export const mockAnalysisResult = {
  feedback: [
    {
      id: '1',
      section: 'summary',
      type: 'suggestion' as const,
      message: 'Add more specific achievements',
      severity: 'medium' as const,
    },
    {
      id: '2',
      section: 'experience',
      type: 'warning' as const,
      message: 'Missing quantifiable results',
      severity: 'high' as const,
    },
  ],
  score: {
    overall: 75,
    breakdown: {
      completeness: 80,
      quality: 70,
      atsCompatibility: 75,
      impact: 75,
    },
    recommendations: [
      'Add more skills',
      'Include certifications',
      'Quantify achievements',
    ],
  },
};

export const mockJobMatchResult = {
  score: 80,
  matchedKeywords: ['React', 'TypeScript', 'Node.js'],
  missingKeywords: ['AWS', 'Docker'],
  suggestions: [
    'Add AWS experience to skills',
    'Mention Docker projects',
  ],
};

export const mockImproveTextResult = {
  improvedText: 'Enhanced version of the text with better impact',
  explanation: 'Made the text more action-oriented and quantifiable',
  keyChanges: [
    'Changed "worked on" to "led development of"',
    'Added metrics and results',
  ],
};

/**
 * Mock CV Repository
 */

export const createMockCVRepository = (): ICVRepository => ({
  getAll: vi.fn().mockResolvedValue([mockSavedCV]),
  getById: vi.fn().mockResolvedValue(mockSavedCV),
  create: vi.fn().mockResolvedValue(mockSavedCV),
  update: vi.fn().mockResolvedValue({ ...mockSavedCV, updatedAt: new Date() }),
  delete: vi.fn().mockResolvedValue(undefined),
  setDefault: vi.fn().mockResolvedValue(undefined),
  duplicate: vi.fn().mockResolvedValue({
    ...mockSavedCV,
    id: 'test-cv-2',
    title: 'Test CV (Copy)',
  }),
});

/**
 * Mock Auth Repository
 */

export const createMockAuthRepository = (): IAuthRepository => ({
  signIn: vi.fn().mockResolvedValue({
    user: mockUser,
    session: { access_token: 'test-token' },
  }),
  signUp: vi.fn().mockResolvedValue({
    user: mockUser,
    session: { access_token: 'test-token' },
  }),
  signOut: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockResolvedValue(mockUser),
  onAuthStateChange: vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  }),
});

/**
 * Mock AI Repository
 */

export const createMockAIRepository = (): IAIRepository => ({
  analyzeCV: vi.fn().mockResolvedValue(mockAnalysisResult),
  parseText: vi.fn().mockResolvedValue(initialCVData),
  matchJob: vi.fn().mockResolvedValue(mockJobMatchResult),
  improveText: vi.fn().mockResolvedValue(mockImproveTextResult),
});

/**
 * Helper to create a mock CV with custom data
 */

export const createMockCV = (overrides: Partial<SavedCV> = {}): SavedCV => ({
  ...mockSavedCV,
  ...overrides,
});

/**
 * Helper to create multiple mock CVs
 */

export const createMockCVs = (count: number): SavedCV[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockSavedCV,
    id: `test-cv-${i + 1}`,
    title: `Test CV ${i + 1}`,
  }));
};
