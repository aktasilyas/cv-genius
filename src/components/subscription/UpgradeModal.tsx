import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  X, 
  Check, 
  Sparkles, 
  FileText, 
  Wand2, 
  Linkedin, 
  Briefcase, 
  History,
  Zap,
  Shield,
  Bell
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/context/SettingsContext';
import { PRICING } from '@/types/subscription';
import { isWaitlistMode } from '@/types/waitlist';
import WaitlistModal from '@/components/waitlist/WaitlistModal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const UpgradeModal = ({ isOpen, onClose, feature }: UpgradeModalProps) => {
  const { t, language } = useSettings();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [showWaitlist, setShowWaitlist] = useState(false);

  // In waitlist mode, redirect to waitlist modal
  if (isWaitlistMode()) {
    return (
      <WaitlistModal 
        isOpen={isOpen} 
        onClose={onClose} 
        feature={feature}
        source="upgrade-modal"
      />
    );
  }

  const features = [
    { icon: FileText, text: t('premium.allTemplates') || 'All 6 Premium Templates', free: '2', premium: '6' },
    { icon: Sparkles, text: t('premium.unlimitedCVs') || 'Unlimited CVs', free: '1', premium: '∞' },
    { icon: Wand2, text: t('premium.aiAnalysis') || 'AI CV Analysis', free: false, premium: true },
    { icon: Wand2, text: t('premium.aiParsing') || 'AI Text Parsing', free: false, premium: true },
    { icon: Linkedin, text: t('premium.linkedInImport') || 'LinkedIn Import', free: false, premium: true },
    { icon: Briefcase, text: t('premium.jobMatching') || 'Job Matching', free: false, premium: true },
    { icon: History, text: t('premium.versionHistory') || 'Version History', free: false, premium: true },
    { icon: Zap, text: t('premium.noWatermark') || 'Watermark-Free PDF', free: false, premium: true },
    { icon: Shield, text: t('premium.prioritySupport') || 'Priority Support', free: false, premium: true },
  ];

  const price = billingPeriod === 'yearly' 
    ? `${PRICING.currency}${PRICING.yearlyMonthly}` 
    : `${PRICING.currency}${PRICING.monthly}`;
  
  const totalPrice = billingPeriod === 'yearly' 
    ? `${PRICING.currency}${PRICING.yearly}` 
    : `${PRICING.currency}${PRICING.monthly}`;

  const savings = Math.round(((PRICING.monthly * 12 - PRICING.yearly) / (PRICING.monthly * 12)) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent p-6 text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">CVCraft Premium</h2>
                <p className="text-sm opacity-90">
                  {t('premium.subtitle') || 'Unlock the full power of AI-powered CV building'}
                </p>
              </div>
            </div>

            {feature && (
              <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-sm">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {t('premium.featureRequired') || 'This feature requires Premium:'}
                  <span className="font-semibold ml-1">{feature}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('premium.monthly') || 'Monthly'}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
                billingPeriod === 'yearly' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('premium.yearly') || 'Yearly'}
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5">
                -{savings}%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 text-center border-b">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">/{t('premium.perMonth') || 'mo'}</span>
          </div>
          {billingPeriod === 'yearly' && (
            <p className="text-sm text-muted-foreground mt-1">
              {t('premium.billedYearly') || 'Billed yearly'}: {totalPrice}
            </p>
          )}
        </div>

        {/* Features Comparison */}
        <div className="p-6">
          <div className="grid grid-cols-[1fr,60px,60px] gap-2 text-sm mb-4">
            <div className="font-medium">{t('premium.feature') || 'Feature'}</div>
            <div className="text-center font-medium text-muted-foreground">{t('premium.free') || 'Free'}</div>
            <div className="text-center font-medium text-primary">{t('premium.premium') || 'Premium'}</div>
          </div>

          <div className="space-y-3">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[1fr,60px,60px] gap-2 items-center py-2 border-b border-border/50"
              >
                <div className="flex items-center gap-2">
                  <feat.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{feat.text}</span>
                </div>
                <div className="text-center">
                  {typeof feat.free === 'boolean' ? (
                    feat.free ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                    )
                  ) : (
                    <span className="text-muted-foreground">{feat.free}</span>
                  )}
                </div>
                <div className="text-center">
                  {typeof feat.premium === 'boolean' ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="font-medium text-primary">{feat.premium}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 bg-secondary/30">
          <Button 
            className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            onClick={() => {
              // TODO: Integrate payment checkout
              console.log('Upgrade to premium:', billingPeriod);
            }}
          >
            <Crown className="w-5 h-5" />
            {t('premium.upgradeNow') || 'Upgrade to Premium'}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            {t('premium.guarantee') || '7-day money-back guarantee • Cancel anytime'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
