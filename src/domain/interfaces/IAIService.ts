import { CVData } from '../entities/CVData';

/**
 * AI Feedback types
 */
export type AIFeedbackType = 'warning' | 'suggestion' | 'improvement';

export interface AIFeedback {
  id: string;
  section: keyof CVData;
  type: AIFeedbackType;
  message: string;
  suggestion?: string;
  explanation?: string;
  improvedText?: string;
  applied?: boolean;
}

/**
 * CV Score breakdown
 */
export interface CVScore {
  overall: number;
  breakdown: {
    completeness: number;
    quality: number;
    atsCompatibility: number;
    impact: number;
  };
  recommendations: string[];
}

/**
 * Job matching result
 */
export interface JobMatch {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

/**
 * AI Service interface for CV analysis and improvement
 */
export interface IAIService {
  /**
   * Analyzes CV and provides feedback
   */
  analyzeCv(cvData: CVData): Promise<AIFeedback[]>;

  /**
   * Calculates CV score
   */
  scoreCv(cvData: CVData): Promise<CVScore>;

  /**
   * Improves CV text using AI
   */
  improveText(text: string, context: string): Promise<string>;

  /**
   * Matches CV against job description
   */
  matchJob(cvData: CVData, jobDescription: string): Promise<JobMatch>;

  /**
   * Generates CV summary from provided information
   */
  generateSummary(cvData: CVData): Promise<string>;

  /**
   * Extracts CV data from text (LinkedIn export, etc.)
   */
  extractFromText(text: string): Promise<Partial<CVData>>;
}
