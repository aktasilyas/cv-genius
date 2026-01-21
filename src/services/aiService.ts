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

const handleEdgeFunctionResponse = async (response: any, functionName: string) => {
  // Check for error in response
  if (response.error) {
    console.error(`Edge Function ${functionName} error:`, response.error);

    // Auth errors
    if (response.error.message?.includes('JWT') ||
        response.error.message?.includes('token') ||
        response.error.message?.includes('Authentication') ||
        response.error.message?.includes('401')) {
      throw new Error('Please sign in to use AI features');
    }

    throw new Error(response.error.message || `${functionName} failed`);
  }

  // Check for error in data
  if (response.data?.error) {
    console.error(`Edge Function ${functionName} data error:`, response.data.error);

    if (response.data.error.includes('limit')) {
      throw new Error(response.data.message || 'Daily limit reached');
    }

    if (response.data.error.includes('Authentication') || response.data.error.includes('JWT')) {
      throw new Error('Please sign in to use AI features');
    }

    throw new Error(response.data.error);
  }

  return response.data;
};

export const analyzeCV = async (cvData: CVData, language: string): Promise<AnalysisResult> => {
  const response = await supabase.functions.invoke('analyze-cv', {
    body: { cvData, language }
  });

  return handleEdgeFunctionResponse(response, 'analyze-cv');
};

export const parseCVText = async (text: string, language: string, pdfBase64?: string): Promise<ParseResult> => {
  const response = await supabase.functions.invoke('parse-cv-text', {
    body: { text, language, pdfBase64 }
  });

  return handleEdgeFunctionResponse(response, 'parse-cv-text');
};

export const matchJob = async (cvData: CVData, jobDescription: string, language: string): Promise<JobMatchResult> => {
  const response = await supabase.functions.invoke('match-job', {
    body: { cvData, jobDescription, language }
  });

  return handleEdgeFunctionResponse(response, 'match-job');
};

export const improveText = async (text: string, type: 'summary' | 'experience' | 'education' | 'skill', language: string): Promise<ImproveTextResult> => {
  const response = await supabase.functions.invoke('improve-text', {
    body: { text, type, language }
  });

  return handleEdgeFunctionResponse(response, 'improve-text');
};
