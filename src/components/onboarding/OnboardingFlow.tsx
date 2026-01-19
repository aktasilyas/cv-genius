import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Briefcase, 
  GraduationCap, 
  Rocket, 
  Target, 
  Sparkles,
  CheckCircle,
  FileText,
  Wand2,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { useCVContext } from '@/context/CVContext';

interface OnboardingAnswer {
  goal: string;
  experience: string;
  industry: string;
  priority: string;
}

interface OnboardingFlowProps {
  onComplete: (answers: OnboardingAnswer) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { t } = useSettings();
  const { setCreationMode } = useCVContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer>({
    goal: '',
    experience: '',
    industry: '',
    priority: '',
  });
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    {
      id: 'welcome',
      type: 'welcome',
      title: t('onboarding.welcomeTitle') || 'Welcome to CVCraft! 👋',
      subtitle: t('onboarding.welcomeSubtitle') || "Let's create your perfect CV in minutes",
      description: t('onboarding.welcomeDesc') || "Answer a few quick questions so we can personalize your experience.",
    },
    {
      id: 'goal',
      type: 'question',
      title: t('onboarding.goalTitle') || 'What brings you here today?',
      subtitle: t('onboarding.goalSubtitle') || 'This helps us tailor your experience',
      options: [
        { 
          id: 'job-search', 
          icon: Briefcase, 
          label: t('onboarding.goalJobSearch') || 'Looking for a new job',
          description: t('onboarding.goalJobSearchDesc') || 'Actively searching for opportunities'
        },
        { 
          id: 'career-change', 
          icon: Rocket, 
          label: t('onboarding.goalCareerChange') || 'Changing careers',
          description: t('onboarding.goalCareerChangeDesc') || 'Transitioning to a new field'
        },
        { 
          id: 'update-cv', 
          icon: FileText, 
          label: t('onboarding.goalUpdateCV') || 'Updating my CV',
          description: t('onboarding.goalUpdateCVDesc') || 'Refreshing my existing resume'
        },
        { 
          id: 'first-cv', 
          icon: GraduationCap, 
          label: t('onboarding.goalFirstCV') || 'Creating my first CV',
          description: t('onboarding.goalFirstCVDesc') || 'Just starting my career'
        },
      ],
      key: 'goal' as keyof OnboardingAnswer,
    },
    {
      id: 'experience',
      type: 'question',
      title: t('onboarding.expTitle') || 'How much work experience do you have?',
      subtitle: t('onboarding.expSubtitle') || "We'll suggest the best template for you",
      options: [
        { 
          id: 'student', 
          icon: GraduationCap, 
          label: t('onboarding.expStudent') || 'Student / Fresh Graduate',
          description: t('onboarding.expStudentDesc') || 'Less than 1 year'
        },
        { 
          id: 'junior', 
          icon: Briefcase, 
          label: t('onboarding.expJunior') || 'Early Career',
          description: t('onboarding.expJuniorDesc') || '1-3 years'
        },
        { 
          id: 'mid', 
          icon: Target, 
          label: t('onboarding.expMid') || 'Mid-Level',
          description: t('onboarding.expMidDesc') || '3-7 years'
        },
        { 
          id: 'senior', 
          icon: Rocket, 
          label: t('onboarding.expSenior') || 'Senior / Executive',
          description: t('onboarding.expSeniorDesc') || '7+ years'
        },
      ],
      key: 'experience' as keyof OnboardingAnswer,
    },
    {
      id: 'industry',
      type: 'question',
      title: t('onboarding.industryTitle') || 'What industry are you in?',
      subtitle: t('onboarding.industrySubtitle') || 'This helps us optimize your CV format',
      options: [
        { 
          id: 'tech', 
          icon: Sparkles, 
          label: t('onboarding.industryTech') || 'Tech / Software',
          description: t('onboarding.industryTechDesc') || 'Engineering, IT, Data'
        },
        { 
          id: 'business', 
          icon: Briefcase, 
          label: t('onboarding.industryBusiness') || 'Business / Finance',
          description: t('onboarding.industryBusinessDesc') || 'Consulting, Banking, Management'
        },
        { 
          id: 'creative', 
          icon: FileText, 
          label: t('onboarding.industryCreative') || 'Creative / Design',
          description: t('onboarding.industryCreativeDesc') || 'Marketing, Design, Media'
        },
        { 
          id: 'other', 
          icon: Target, 
          label: t('onboarding.industryOther') || 'Other Industries',
          description: t('onboarding.industryOtherDesc') || 'Healthcare, Education, etc.'
        },
      ],
      key: 'industry' as keyof OnboardingAnswer,
    },
    {
      id: 'priority',
      type: 'question',
      title: t('onboarding.priorityTitle') || "What's most important to you?",
      subtitle: t('onboarding.prioritySubtitle') || "We'll focus on what matters most",
      options: [
        { 
          id: 'speed', 
          icon: Rocket, 
          label: t('onboarding.prioritySpeed') || 'Quick & Easy',
          description: t('onboarding.prioritySpeedDesc') || 'Get a CV done fast'
        },
        { 
          id: 'quality', 
          icon: Sparkles, 
          label: t('onboarding.priorityQuality') || 'Professional Quality',
          description: t('onboarding.priorityQualityDesc') || 'Stand out from the crowd'
        },
        { 
          id: 'ats', 
          icon: Target, 
          label: t('onboarding.priorityATS') || 'ATS Optimization',
          description: t('onboarding.priorityATSDesc') || 'Pass applicant tracking systems'
        },
        { 
          id: 'customization', 
          icon: FileText, 
          label: t('onboarding.priorityCustom') || 'Full Customization',
          description: t('onboarding.priorityCustomDesc') || 'Control every detail'
        },
      ],
      key: 'priority' as keyof OnboardingAnswer,
    },
    {
      id: 'method',
      type: 'method',
      title: t('onboarding.methodTitle') || 'How would you like to start?',
      subtitle: t('onboarding.methodSubtitle') || 'Choose your preferred method',
    },
  ];

  const handleOptionSelect = (optionId: string) => {
    const currentQuestion = steps[currentStep];
    if (currentQuestion.type === 'question' && currentQuestion.key) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.key!]: optionId,
      }));
      
      // Auto-advance after selection with a small delay
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    }
  };

  const handleMethodSelect = (method: 'structured' | 'ai-text' | 'linkedin') => {
    setIsCompleting(true);
    setCreationMode(method);
    
    setTimeout(() => {
      onComplete(answers);
    }, 800);
  };

  const progress = (currentStep / (steps.length - 1)) * 100;
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress Bar */}
      {currentStep > 0 && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            {/* Welcome Step */}
            {step.type === 'welcome' && (
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <FileText className="w-10 h-10 text-primary" />
                </motion.div>
                
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-display font-bold"
                  >
                    {step.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-muted-foreground"
                  >
                    {step.subtitle}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground"
                  >
                    {step.description}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    size="lg"
                    variant="accent"
                    onClick={() => setCurrentStep(1)}
                    className="gap-2 px-8"
                  >
                    {t('onboarding.getStarted') || "Let's Get Started"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>

                {/* Skip Option */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => onComplete(answers)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('onboarding.skip') || 'Skip and start building'}
                </motion.button>
              </div>
            )}

            {/* Question Steps */}
            {step.type === 'question' && 'options' in step && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-display font-bold"
                  >
                    {step.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                  >
                    {step.subtitle}
                  </motion.p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {step.options.map((option, index) => {
                    const Icon = option.icon;
                    const isSelected = answers[step.key!] === option.id;
                    
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 group ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                        
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary group-hover:bg-primary/10'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <h3 className="font-semibold mb-1">{option.label}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Method Selection Step */}
            {step.type === 'method' && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-green-500/10 flex items-center justify-center mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-display font-bold"
                  >
                    {t('onboarding.almostDone') || "You're all set!"} 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                  >
                    {step.subtitle}
                  </motion.p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      id: 'structured',
                      icon: FileText,
                      title: t('onboarding.methodManual') || 'Manual Entry',
                      description: t('onboarding.methodManualDesc') || 'Fill in step by step',
                      color: 'bg-blue-500',
                    },
                    {
                      id: 'ai-text',
                      icon: Wand2,
                      title: t('onboarding.methodAI') || 'AI Parse',
                      description: t('onboarding.methodAIDesc') || 'Paste text, AI structures it',
                      color: 'bg-purple-500',
                      recommended: true,
                    },
                    {
                      id: 'linkedin',
                      icon: Linkedin,
                      title: t('onboarding.methodLinkedIn') || 'LinkedIn Import',
                      description: t('onboarding.methodLinkedInDesc') || 'Import from LinkedIn PDF',
                      color: 'bg-[#0A66C2]',
                    },
                  ].map((method, index) => (
                    <motion.button
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={() => handleMethodSelect(method.id as 'structured' | 'ai-text' | 'linkedin')}
                      disabled={isCompleting}
                      className={`relative p-6 rounded-xl border-2 border-border hover:border-primary text-center transition-all duration-200 group ${
                        isCompleting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {method.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          {t('onboarding.recommended') || 'Recommended'}
                        </div>
                      )}
                      
                      <div className={`w-14 h-14 mx-auto rounded-xl ${method.color} flex items-center justify-center mb-4`}>
                        <method.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="font-semibold mb-1">{method.title}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back Button */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="fixed bottom-8 left-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            {t('btn.previous') || 'Back'}
          </Button>
        </div>
      )}

      {/* Step Indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'w-8 bg-primary'
                : index < currentStep
                ? 'bg-primary/50'
                : 'bg-secondary'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OnboardingFlow;
