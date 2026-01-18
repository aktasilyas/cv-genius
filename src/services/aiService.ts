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
  const { data, error } = await supabase.functions.invoke('analyze-cv', {
    body: { cvData, language }
  });

  if (error) {
    console.error('Error analyzing CV:', error);
    throw new Error(error.message || 'Failed to analyze CV');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const parseCVText = async (text: string, language: string): Promise<ParseResult> => {
  const { data, error } = await supabase.functions.invoke('parse-cv-text', {
    body: { text, language }
  });

  if (error) {
    console.error('Error parsing CV text:', error);
    throw new Error(error.message || 'Failed to parse CV text');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const matchJob = async (cvData: CVData, jobDescription: string, language: string): Promise<JobMatchResult> => {
  const { data, error } = await supabase.functions.invoke('match-job', {
    body: { cvData, jobDescription, language }
  });

  if (error) {
    console.error('Error matching job:', error);
    throw new Error(error.message || 'Failed to match job');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const improveText = async (text: string, type: 'summary' | 'experience' | 'education' | 'skill', language: string): Promise<ImproveTextResult> => {
  const { data, error } = await supabase.functions.invoke('improve-text', {
    body: { text, type, language }
  });

  if (error) {
    console.error('Error improving text:', error);
    throw new Error(error.message || 'Failed to improve text');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};
