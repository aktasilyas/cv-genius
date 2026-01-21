import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { FREE_LIMITS, PREMIUM_LIMITS, AIFunctionName } from '@/domain/value-objects/AIUsageLimits';

interface AIUsageRecord {
  function_name: string;
}

export const useAIUsage = () => {
  const { user } = useAuth();
  const { isPremium } = useSubscription();

  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  const { data: usage, isLoading, refetch } = useQuery({
    queryKey: ['ai-usage', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('ai_usage')
        .select('function_name')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00Z`);

      if (error) throw error;

      // Count usage per function
      const counts: Record<string, number> = {};
      (data as AIUsageRecord[] | null)?.forEach(row => {
        const fnName = row.function_name;
        counts[fnName] = (counts[fnName] || 0) + 1;
      });

      return counts;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Map function name to limit key
  const getFunctionKey = (fn: AIFunctionName): string => {
    const mapping: Record<AIFunctionName, string> = {
      analyze: 'analyze-cv',
      parse: 'parse-cv-text',
      matchJob: 'match-job',
      improveText: 'improve-text',
    };
    return mapping[fn];
  };

  const getUsed = (fn: AIFunctionName): number => {
    const key = getFunctionKey(fn);
    return usage?.[key] || 0;
  };

  const getRemaining = (fn: AIFunctionName): number => {
    const used = getUsed(fn);
    return Math.max(0, limits[fn] - used);
  };

  const canUse = (fn: AIFunctionName): boolean => {
    return getRemaining(fn) > 0;
  };

  const getUsagePercentage = (fn: AIFunctionName): number => {
    const used = getUsed(fn);
    const limit = limits[fn];
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return {
    usage,
    limits,
    isLoading,
    isPremium,
    getUsed,
    getRemaining,
    canUse,
    getUsagePercentage,
    refetch,
  };
};
