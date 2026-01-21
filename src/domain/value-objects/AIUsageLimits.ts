export interface AIUsageLimits {
  analyze: number;
  parse: number;
  matchJob: number;
  improveText: number;
}

export const FREE_LIMITS: AIUsageLimits = {
  analyze: 5,      // günde 5 analiz
  parse: 10,       // günde 10 parse
  matchJob: 5,     // günde 5 job match
  improveText: 20  // günde 20 text improvement
};

export const PREMIUM_LIMITS: AIUsageLimits = {
  analyze: 50,
  parse: 100,
  matchJob: 50,
  improveText: 200
};

export type AIFunctionName = keyof AIUsageLimits;
