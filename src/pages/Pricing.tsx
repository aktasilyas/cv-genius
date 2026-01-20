import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  FileText, 
  Wand2, 
  Linkedin, 
  Briefcase, 
  History,
  Zap,
  Shield,
  ArrowRight,
  Bell,
  Gift,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WaitlistModal from '@/components/waitlist/WaitlistModal';
import { isWaitlistMode } from '@/types/waitlist';

const Pricing = () => {
  const { t } = useSettings();
  const [showWaitlist, setShowWaitlist] = useState(false);

  const features = [
    { icon: FileText, text: t('premium.allTemplates') || 'All 6 Premium Templates', free: '2', premium: '6' },
    { icon: Sparkles, text: t('premium.unlimitedCVs') || 'Unlimited CVs', free: '1', premium: '∞' },
    { icon: Wand2, text: t('premium.aiAnalysis') || 'AI CV Analysis', free: true, premium: true },
    { icon: Wand2, text: t('premium.aiParsing') || 'AI Text Parsing', free: true, premium: true },
    { icon: Linkedin, text: t('premium.linkedInImport') || 'LinkedIn Import', free: true, premium: true },
    { icon: Briefcase, text: t('premium.jobMatching') || 'Job Matching', free: true, premium: true },
    { icon: History, text: t('premium.versionHistory') || 'Version History', free: true, premium: true },
    { icon: Zap, text: t('premium.noWatermark') || 'Watermark-Free PDF', free: false, premium: true },
    { icon: Shield, text: t('premium.prioritySupport') || 'Priority Support', free: false, premium: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            {isWaitlistMode() && (
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                <Clock className="w-3 h-3 mr-1" />
                {t('waitlist.launchingSoon') || 'Launching Soon'}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {isWaitlistMode() 
                ? (t('pricing.earlyAccessTitle') || 'Be Among the First')
                : (t('pricing.title') || 'Simple, Transparent Pricing')
              }
            </h1>
            <p className="text-lg text-muted-foreground">
              {isWaitlistMode()
                ? (t('pricing.earlyAccessSubtitle') || 'Premium features are coming soon. Join the waitlist for exclusive early bird benefits.')
                : (t('pricing.subtitle') || 'Choose the plan that fits your needs. Upgrade anytime.')
              }
            </p>
          </motion.div>

          {/* Early Access Benefits Banner */}
          {isWaitlistMode() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto mb-12 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{t('waitlist.earlyBirdTitle') || 'Early Bird Benefits'}</h3>
                  <p className="text-sm text-muted-foreground">{t('waitlist.earlyBirdSubtitle') || 'Join now and unlock exclusive perks'}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{t('waitlist.perk1') || 'Up to 50% discount'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{t('waitlist.perk2') || 'Priority access'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{t('waitlist.perk3') || 'Exclusive updates'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-2 border-border">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{t('premium.free') || 'Free'}</CardTitle>
                  <CardDescription>
                    {isWaitlistMode() 
                      ? (t('pricing.freeDescWaitlist') || 'Try all features during early access')
                      : (t('pricing.freeDesc') || 'Perfect for getting started')
                    }
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₺0</span>
                    <span className="text-muted-foreground">/{t('premium.perMonth') || 'mo'}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {typeof feat.free === 'boolean' ? (
                          feat.free ? (
                            <Check className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                          )
                        ) : (
                          <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                            {feat.free}
                          </span>
                        )}
                        <span className={typeof feat.free === 'boolean' && !feat.free ? 'text-muted-foreground' : ''}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/builder">
                    <Button variant="outline" className="w-full h-12">
                      {t('pricing.getStarted') || 'Get Started'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                  {isWaitlistMode() 
                    ? (t('waitlist.comingSoon') || 'Coming Soon')
                    : (t('pricing.popular') || 'Most Popular')
                  }
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    {t('premium.premium') || 'Premium'}
                  </CardTitle>
                  <CardDescription>
                    {isWaitlistMode()
                      ? (t('pricing.premiumDescWaitlist') || 'Unlock full power when we launch')
                      : (t('pricing.premiumDesc') || 'For serious job seekers')
                    }
                  </CardDescription>
                  <div className="mt-4">
                    {isWaitlistMode() ? (
                      <div>
                        <span className="text-2xl text-muted-foreground line-through">₺59</span>
                        <span className="text-4xl font-bold text-primary ml-2">₺29</span>
                        <span className="text-muted-foreground">/{t('premium.perMonth') || 'mo'}</span>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {t('waitlist.earlyBirdPrice') || 'Early bird price'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">₺42</span>
                        <span className="text-muted-foreground">/{t('premium.perMonth') || 'mo'}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {typeof feat.premium === 'boolean' ? (
                          <Check className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                            {feat.premium}
                          </span>
                        )}
                        <span className="font-medium">{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2"
                    onClick={() => setShowWaitlist(true)}
                  >
                    <Bell className="w-4 h-4" />
                    {isWaitlistMode() 
                      ? (t('waitlist.joinWaitlist') || 'Join the Waitlist')
                      : (t('premium.upgradeNow') || 'Upgrade to Premium')
                    }
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              {isWaitlistMode()
                ? (t('waitlist.noPaymentYet') || 'Payments are not active yet. Join the waitlist to be notified when we launch.')
                : (t('premium.guarantee') || '7-day money-back guarantee • Cancel anytime')
              }
            </p>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              {t('pricing.faq') || 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {isWaitlistMode() ? (
                // Waitlist-specific FAQs
                [
                  {
                    q: t('waitlist.faq1q') || 'When will Premium launch?',
                    a: t('waitlist.faq1a') || "We're working hard to bring you the best experience. Join the waitlist to be the first to know when we launch!"
                  },
                  {
                    q: t('waitlist.faq2q') || 'What can I do during early access?',
                    a: t('waitlist.faq2a') || 'You can create CVs, use AI features, and preview all templates. PDF export with watermark removal will be available with Premium.'
                  },
                  {
                    q: t('waitlist.faq3q') || 'Will I really get a discount?',
                    a: t('waitlist.faq3a') || 'Absolutely! Early waitlist members will receive exclusive discounts of up to 50% off when Premium launches.'
                  },
                ].map((faq, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Regular FAQs
                [
                  {
                    q: t('pricing.faq1q') || 'Can I cancel anytime?',
                    a: t('pricing.faq1a') || "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                  },
                  {
                    q: t('pricing.faq2q') || 'What payment methods do you accept?',
                    a: t('pricing.faq2a') || 'We accept all major credit cards and debit cards through our secure payment processor.'
                  },
                  {
                    q: t('pricing.faq3q') || 'Is there a free trial?',
                    a: t('pricing.faq3a') || 'The free plan allows you to try out the basic features. Premium features can be unlocked instantly when you upgrade.'
                  },
                ].map((faq, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)}
        source="pricing"
      />
    </div>
  );
};

export default Pricing;
