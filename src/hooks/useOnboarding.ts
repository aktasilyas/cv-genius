import { useState, useEffect } from 'react';

interface OnboardingAnswer {
  goal: string;
  experience: string;
  industry: string;
  priority: string;
}

interface OnboardingState {
  hasCompleted: boolean;
  answers: OnboardingAnswer | null;
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem('cv-onboarding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { hasCompleted: false, answers: null };
      }
    }
    return { hasCompleted: false, answers: null };
  });

  const completeOnboarding = (answers: OnboardingAnswer) => {
    const newState = { hasCompleted: true, answers };
    setState(newState);
    localStorage.setItem('cv-onboarding', JSON.stringify(newState));
  };

  const resetOnboarding = () => {
    setState({ hasCompleted: false, answers: null });
    localStorage.removeItem('cv-onboarding');
  };

  const getRecommendedTemplate = (): string => {
    if (!state.answers) return 'modern';
    
    const { experience, industry } = state.answers;
    
    // Recommend template based on answers
    if (industry === 'creative') return 'creative';
    if (industry === 'tech') return 'technical';
    if (experience === 'senior') return 'executive';
    if (experience === 'student') return 'minimal';
    
    return 'modern';
  };

  return {
    hasCompletedOnboarding: state.hasCompleted,
    onboardingAnswers: state.answers,
    completeOnboarding,
    resetOnboarding,
    getRecommendedTemplate,
  };
};
