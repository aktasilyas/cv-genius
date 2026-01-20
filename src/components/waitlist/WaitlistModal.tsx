import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  User, 
  Briefcase, 
  Check,
  Bell,
  Gift,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/context/SettingsContext';
import { waitlistService } from '@/services/waitlistService';
import { toast } from 'sonner';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  source?: string;
}

const industries = [
  { value: 'tech', label: 'Technology / Software' },
  { value: 'finance', label: 'Finance / Banking' },
  { value: 'marketing', label: 'Marketing / Creative' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'sales', label: 'Sales / Business' },
  { value: 'other', label: 'Other' },
];

const WaitlistModal = ({ isOpen, onClose, feature, source = 'app' }: WaitlistModalProps) => {
  const { t, language } = useSettings();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('waitlist.emailRequired') || 'Email is required');
      return;
    }

    setIsSubmitting(true);

    const result = await waitlistService.joinWaitlist({
      email,
      name: name || undefined,
      job_title: jobTitle || undefined,
      industry: industry || undefined,
      language_preference: language,
      source,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      toast.success(t('waitlist.success') || "You're on the list! We'll notify you when Premium launches.");
    } else if (result.error === 'already_registered') {
      toast.info(t('waitlist.alreadyRegistered') || "You're already on the waitlist!");
      setIsSuccess(true);
    } else {
      toast.error(t('waitlist.error') || 'Something went wrong. Please try again.');
    }
  };

  const benefits = [
    { icon: Gift, text: t('waitlist.benefitDiscount') || 'Early bird discount (up to 50% off)' },
    { icon: Zap, text: t('waitlist.benefitAccess') || 'Priority access to Premium features' },
    { icon: Bell, text: t('waitlist.benefitUpdates') || 'Exclusive updates & tips' },
  ];

  const handleClose = () => {
    setIsSuccess(false);
    setEmail('');
    setName('');
    setJobTitle('');
    setIndustry('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent p-6 text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {t('waitlist.comingSoon') || 'Coming Soon'}
            </Badge>
            <h2 className="text-2xl font-display font-bold mb-2">
              {t('waitlist.title') || 'Get Early Access'}
            </h2>
            <p className="text-sm opacity-90">
              {t('waitlist.subtitle') || 'Premium features are launching soon. Join the waitlist for exclusive benefits.'}
            </p>

            {feature && (
              <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-sm">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {t('waitlist.featureTeaser') || 'You tried to access:'}
                  <span className="font-semibold ml-1">{feature}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {isSuccess ? (
          /* Success State */
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">
              {t('waitlist.successTitle') || "You're on the list!"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('waitlist.successMessage') || "We'll email you when Premium launches with your exclusive discount."}
            </p>
            <Button onClick={handleClose} className="gap-2">
              {t('waitlist.continue') || 'Continue Building'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div className="px-6 pt-6">
              <p className="text-sm font-medium mb-3">
                {t('waitlist.benefitsTitle') || 'Early access members get:'}
              </p>
              <div className="space-y-2">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('waitlist.email') || 'Email'} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('waitlist.name') || 'Name'}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {t('waitlist.jobTitle') || 'Job Title'}
                  </Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  {t('waitlist.industry') || 'Industry'}
                </Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('waitlist.selectIndustry') || 'Select your industry'} />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    {t('waitlist.joining') || 'Joining...'}
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    {t('waitlist.join') || 'Join the Waitlist'}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {t('waitlist.privacy') || "We respect your privacy. No spam, ever."}
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;
