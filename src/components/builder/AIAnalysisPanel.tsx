import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import { AIFeedback } from '@/types/cv';

const AIAnalysisPanel = () => {
  const { cvData, aiFeedback, setAIFeedback, isAnalyzing, setIsAnalyzing } = useCVContext();

  const analyzeCV = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const feedback: AIFeedback[] = [];
      
      // Check summary
      if (!cvData.summary || cvData.summary.length < 50) {
        feedback.push({
          id: '1',
          section: 'summary',
          type: 'warning',
          message: 'Your professional summary is too short',
          suggestion: 'Add a compelling 3-4 sentence summary highlighting your key achievements and career goals.'
        });
      }

      // Check experience
      if (cvData.experience.length === 0) {
        feedback.push({
          id: '2',
          section: 'experience',
          type: 'warning',
          message: 'No work experience added',
          suggestion: 'Add at least one relevant work experience to strengthen your CV.'
        });
      } else {
        cvData.experience.forEach((exp, index) => {
          if (!exp.description || exp.description.length < 100) {
            feedback.push({
              id: `exp-${index}`,
              section: 'experience',
              type: 'suggestion',
              message: `Experience at "${exp.company || 'Unknown'}" lacks detail`,
              suggestion: 'Add specific achievements with measurable results. Use action verbs and quantify your impact.'
            });
          }
        });
      }

      // Check skills
      if (cvData.skills.length < 5) {
        feedback.push({
          id: '3',
          section: 'skills',
          type: 'improvement',
          message: 'Consider adding more skills',
          suggestion: 'Include 8-12 relevant skills to pass ATS systems and catch recruiters\' attention.'
        });
      }

      // Check education
      if (cvData.education.length === 0) {
        feedback.push({
          id: '4',
          section: 'education',
          type: 'suggestion',
          message: 'No education added',
          suggestion: 'Add your educational background to provide a complete picture of your qualifications.'
        });
      }

      // Personal info checks
      if (!cvData.personalInfo.linkedin) {
        feedback.push({
          id: '5',
          section: 'personalInfo',
          type: 'improvement',
          message: 'Missing LinkedIn profile',
          suggestion: 'Adding your LinkedIn URL helps recruiters learn more about your professional network.'
        });
      }

      if (feedback.length === 0) {
        feedback.push({
          id: 'perfect',
          section: 'summary',
          type: 'improvement',
          message: 'Your CV looks great!',
          suggestion: 'Consider tailoring it for specific job applications for even better results.'
        });
      }

      setAIFeedback(feedback);
      setIsAnalyzing(false);
    }, 2000);
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
    <div className="card-elevated p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">AI Analysis</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={analyzeCV}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {aiFeedback.length === 0 && !isAnalyzing ? (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm mb-4">
            Click "Analyze" to get AI-powered suggestions for improving your CV
          </p>
          <Button variant="accent" onClick={analyzeCV}>
            Start Analysis
          </Button>
        </div>
      ) : isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground">Analyzing your CV...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {aiFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getColor(item.type)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(item.type)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.message}</p>
                  {item.suggestion && (
                    <p className="text-muted-foreground text-xs mt-1">{item.suggestion}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
