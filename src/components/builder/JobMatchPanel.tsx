import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, Target, CheckCircle2, XCircle, Lightbulb, Sparkles } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { matchJob } from '@/services/aiService';
import { AuthRequiredModal } from '@/presentation/components/auth/AuthGuard';
import { toast } from 'sonner';

const JobMatchPanel = () => {
  const { cvData, jobMatch, setJobMatch } = useCVContext();
  const { t, language } = useSettings();
  const { isAuthenticated } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleMatchClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    handleMatchJob();
  };

  const handleMatchJob = async () => {
    if (!jobDescription.trim()) {
      toast.error(t('job.noDescription') || 'Please enter a job description');
      return;
    }

    setIsMatching(true);
    try {
      const result = await matchJob(cvData, jobDescription, language);
      setJobMatch(result);
      toast.success(t('job.matchSuccess') || 'Job matching complete!');
    } catch (error) {
      console.error('Job match error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to match job';
      toast.error(errorMessage);

      // Auth hatası ise modal aç
      if (errorMessage.includes('sign in') || errorMessage.includes('Authentication')) {
        setShowAuthModal(true);
      }
    } finally {
      setIsMatching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">{t('job.title') || 'Job Matching'}</h3>
          <p className="text-sm text-muted-foreground">
            {t('job.subtitle') || 'Optimize your CV for a specific job'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={t('job.placeholder') || 'Paste the job description here...'}
          className="min-h-[150px] resize-none"
        />

        <Button
          onClick={handleMatchClick}
          disabled={isMatching || !jobDescription.trim()}
          className="w-full gap-2"
          variant="accent"
        >
          {isMatching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Target className="w-4 h-4" />
          )}
          {isMatching 
            ? (t('job.matching') || 'Analyzing...') 
            : (t('job.analyze') || 'Analyze Match')}
        </Button>
      </div>

      {jobMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Match Score */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center">
            <div className="relative inline-flex items-center justify-center mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-secondary"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={getScoreColor(jobMatch.score)}
                  initial={{ strokeDasharray: '0 213.6' }}
                  animate={{ 
                    strokeDasharray: `${(jobMatch.score / 100) * 213.6} 213.6` 
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <span className={`absolute text-xl font-bold ${getScoreColor(jobMatch.score)}`}>
                {jobMatch.score}%
              </span>
            </div>
            <p className="text-sm font-medium">{t('job.matchScore') || 'Match Score'}</p>
          </div>

          {/* Matched Keywords */}
          {jobMatch.matchedKeywords.length > 0 && (
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="font-medium text-sm">{t('job.matchedKeywords') || 'Matched Keywords'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobMatch.matchedKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-success/10 text-success text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {jobMatch.missingKeywords.length > 0 && (
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-warning" />
                <span className="font-medium text-sm">{t('job.missingKeywords') || 'Missing Keywords'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobMatch.missingKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {jobMatch.suggestions.length > 0 && (
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">{t('job.suggestions') || 'Optimization Tips'}</span>
              </div>
              <ul className="space-y-2">
                {jobMatch.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-accent mt-1 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        feature="Job Matching"
      />
    </div>
  );
};

export default JobMatchPanel;
