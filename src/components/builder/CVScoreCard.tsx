import { motion } from 'framer-motion';
import { Trophy, Target, Shield, Zap, TrendingUp } from 'lucide-react';
import { CVScore } from '@/types/cv';
import { useSettings } from '@/context/SettingsContext';

interface CVScoreCardProps {
  score: CVScore | null;
  isLoading?: boolean;
}

const CVScoreCard = ({ score, isLoading }: CVScoreCardProps) => {
  const { t } = useSettings();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-accent/20 rounded-full mx-auto" />
          <div className="h-4 bg-accent/20 rounded w-3/4 mx-auto" />
          <div className="h-3 bg-accent/20 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!score) {
    return null;
  }

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreGradient = (value: number) => {
    if (value >= 80) return 'from-success/20 to-success/5';
    if (value >= 60) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const metrics = [
    { 
      key: 'completeness', 
      label: t('score.completeness') || 'Completeness', 
      icon: Target,
      value: score.breakdown.completeness 
    },
    { 
      key: 'quality', 
      label: t('score.quality') || 'Content Quality', 
      icon: Trophy,
      value: score.breakdown.quality 
    },
    { 
      key: 'atsCompatibility', 
      label: t('score.ats') || 'ATS Compatibility', 
      icon: Shield,
      value: score.breakdown.atsCompatibility 
    },
    { 
      key: 'impact', 
      label: t('score.impact') || 'Impact', 
      icon: Zap,
      value: score.breakdown.impact 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${getScoreGradient(score.overall)} rounded-xl p-6 border border-accent/20`}
    >
      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={getScoreColor(score.overall)}
              initial={{ strokeDasharray: '0 251.2' }}
              animate={{ 
                strokeDasharray: `${(score.overall / 100) * 251.2} 251.2` 
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <span className={`absolute text-2xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t('score.overall') || 'CV Score'}
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((metric) => (
          <div 
            key={metric.key}
            className="bg-background/50 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    metric.value >= 80 ? 'bg-success' : 
                    metric.value >= 60 ? 'bg-warning' : 'bg-destructive'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <span className="text-sm font-medium">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Recommendations */}
      {score.recommendations.length > 0 && (
        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">{t('score.topRecommendations') || 'Top Recommendations'}</span>
          </div>
          <ul className="space-y-1">
            {score.recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-accent">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default CVScoreCard;
