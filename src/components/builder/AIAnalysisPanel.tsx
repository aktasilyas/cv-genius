import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle2, Loader2, RefreshCw, Wand2, Info } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AIFeedback } from '@/types/cv';
import { analyzeCV } from '@/services/aiService';
import CVScoreCard from './CVScoreCard';
import { AuthRequiredModal } from '@/presentation/components/auth/AuthGuard';
import { toast } from 'sonner';

const AIAnalysisPanel = () => {
  const { cvData, aiFeedback, setAIFeedback, isAnalyzing, setIsAnalyzing, cvScore, setCVScore } = useCVContext();
  const { t, language } = useSettings();
  const { isAuthenticated } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAnalyzeClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    analyzeWithAI();
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCV(cvData, language);
      setAIFeedback(result.feedback);
      setCVScore(result.score);
      toast.success(t('ai.analysisComplete') || 'Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze CV';
      toast.error(errorMessage);

      // Auth hatası ise modal aç
      if (errorMessage.includes('sign in') || errorMessage.includes('Authentication')) {
        setShowAuthModal(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIcon = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-accent" />;
      case 'improvement':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
    }
  };

  const getColor = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      case 'suggestion':
        return 'border-accent/30 bg-accent/5';
      case 'improvement':
        return 'border-success/30 bg-success/5';
    }
  };

  return (
    <div className="card-elevated p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('ai.title') || 'AI Analysis'}</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isAnalyzing ? (t('ai.analyzing') || 'Analyzing...') : (t('btn.analyze') || 'Analyze')}
        </Button>
      </div>

      {/* CV Score */}
      <div className="mb-6">
        <CVScoreCard score={cvScore} isLoading={isAnalyzing} />
      </div>

      {aiFeedback.length === 0 && !isAnalyzing ? (
        <div className="text-center py-8">
          <Wand2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm mb-4">
            {t('ai.empty') || 'Click "Analyze" to get AI-powered suggestions'}
          </p>
          <Button variant="accent" onClick={handleAnalyzeClick}>
            {t('ai.startAnalysis') || 'Start Analysis'}
          </Button>
        </div>
      ) : isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground">{t('ai.analyzing') || 'Analyzing your CV...'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {aiFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer ${getColor(item.type)}`}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-start gap-3">
                {getIcon(item.type)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.message}</p>
                  {item.suggestion && (
                    <p className="text-muted-foreground text-xs mt-1">{item.suggestion}</p>
                  )}
                  
                  {expandedId === item.id && item.explanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-border/50"
                    >
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <p>{item.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        feature="AI CV Analysis"
      />
    </div>
  );
};

export default AIAnalysisPanel;
