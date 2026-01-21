import { supabase } from '@/integrations/supabase/client';
import { CVData, AIFeedback, CVScore, JobMatch } from '@/types/cv';

export interface AnalysisResult {
  feedback: AIFeedback[];
  score: CVScore;
}

export interface ParseResult {
  personalInfo: CVData['personalInfo'];
  summary: string;
  experience: CVData['experience'];
  education: CVData['education'];
  skills: CVData['skills'];
  languages: CVData['languages'];
  certificates: CVData['certificates'];
}

export interface ImproveTextResult {
  improvedText: string;
  explanation: string;
  keyChanges: string[];
}

export interface JobMatchResult extends JobMatch {
  optimizedSummary?: string;
  optimizedSkills?: string[];
}

export const analyzeCV = async (cvData: CVData, language: string): Promise<AnalysisResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-cv', {
      body: { cvData, language }
    });

    // Always check for error first
    if (error) {
      console.warn('Edge Function error, using fallback analysis:', error);
      return fallbackAnalyzeCV();
    }

    if (data?.error) {
      console.warn('Edge Function returned error, using fallback analysis:', data.error);
      return fallbackAnalyzeCV();
    }

    return data;
  } catch (error) {
    console.warn('Failed to call Edge Function, using fallback analysis:', error);
    return fallbackAnalyzeCV();
  }
};

// Fallback analysis for when Edge Function is unavailable
const fallbackAnalyzeCV = (): AnalysisResult => {
  console.log('Using fallback CV analysis - AI features unavailable');

  return {
    feedback: [
      {
        id: crypto.randomUUID(),
        type: 'suggestion',
        section: 'personalInfo',
        message: 'AI analysis is currently unavailable. Please check your internet connection or try again later.',
      }
    ],
    score: {
      overall: 0,
      breakdown: {
        completeness: 0,
        quality: 0,
        atsCompatibility: 0,
        impact: 0
      },
      recommendations: [
        'AI analysis service is currently unavailable',
        'Please try again later or check your connection'
      ]
    }
  };
};

export const parseCVText = async (text: string, language: string, pdfBase64?: string): Promise<ParseResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('parse-cv-text', {
      body: { text, language, pdfBase64 }
    });

    // Always check for error first
    if (error) {
      console.warn('Edge Function error, using fallback parsing:', error);
      return fallbackParseCVText(text);
    }

    if (data?.error) {
      console.warn('Edge Function returned error, using fallback parsing:', data.error);
      return fallbackParseCVText(text);
    }

    return data;
  } catch (error) {
    // Catch any network/CORS errors
    console.warn('Failed to call Edge Function, using fallback parsing:', error);
    return fallbackParseCVText(text);
  }
};

// Simple fallback parser for when Edge Function is unavailable
const fallbackParseCVText = (text: string): ParseResult => {
  console.log('Using fallback CV text parser - AI parsing unavailable');

  return {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      title: ''
    },
    summary: text.substring(0, 200), // First 200 chars as summary
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: []
  };
};

export const matchJob = async (cvData: CVData, jobDescription: string, language: string): Promise<JobMatchResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('match-job', {
      body: { cvData, jobDescription, language }
    });

    if (error) {
      console.warn('Edge Function error, using fallback job match:', error);
      return fallbackMatchJob();
    }

    if (data?.error) {
      console.warn('Edge Function returned error, using fallback job match:', data.error);
      return fallbackMatchJob();
    }

    return data;
  } catch (error) {
    console.warn('Failed to call Edge Function, using fallback job match:', error);
    return fallbackMatchJob();
  }
};

const fallbackMatchJob = (): JobMatchResult => {
  console.log('Using fallback job matching - AI features unavailable');

  return {
    score: 0,
    matchedKeywords: [],
    missingKeywords: [],
    suggestions: ['AI job matching is currently unavailable. Please try again later.']
  };
};

export const improveText = async (text: string, type: 'summary' | 'experience' | 'education' | 'skill', language: string): Promise<ImproveTextResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('improve-text', {
      body: { text, type, language }
    });

    if (error) {
      console.warn('Edge Function error, using fallback text improvement:', error);
      return fallbackImproveText(text);
    }

    if (data?.error) {
      console.warn('Edge Function returned error, using fallback text improvement:', data.error);
      return fallbackImproveText(text);
    }

    return data;
  } catch (error) {
    console.warn('Failed to call Edge Function, using fallback text improvement:', error);
    return fallbackImproveText(text);
  }
};

const fallbackImproveText = (text: string): ImproveTextResult => {
  console.log('Using fallback text improvement - AI features unavailable');

  return {
    improvedText: text,
    explanation: 'AI text improvement is currently unavailable.',
    keyChanges: ['AI service is not accessible at the moment']
  };
};
