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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';
import { useSubscriptionContext } from '@/context/SubscriptionContext';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { PRICING } from '@/types/subscription';

const Pricing = () => {
  const { t } = useSettings();
  const { isPremium } = useSubscriptionContext();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const price = billingPeriod === 'yearly' 
    ? `${PRICING.currency}${PRICING.yearlyMonthly}` 
    : `${PRICING.currency}${PRICING.monthly}`;
  
  const totalPrice = billingPeriod === 'yearly' 
    ? `${PRICING.currency}${PRICING.yearly}` 
    : `${PRICING.currency}${PRICING.monthly}`;

  const savings = Math.round(((PRICING.monthly * 12 - PRICING.yearly) / (PRICING.monthly * 12)) * 100);

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
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Crown className="w-3 h-3 mr-1" />
              {t('nav.pricing') || 'Pricing'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('pricing.title') || 'Simple, Transparent Pricing'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('pricing.subtitle') || 'Choose the plan that fits your needs. Upgrade anytime.'}
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('premium.monthly') || 'Monthly'}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
                billingPeriod === 'yearly' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('premium.yearly') || 'Yearly'}
              <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2">
                -{savings}%
              </Badge>
            </button>
          </div>

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
                  <CardDescription>{t('pricing.freeDesc') || 'Perfect for getting started'}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{PRICING.currency}0</span>
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
                  {t('pricing.popular') || 'Most Popular'}
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    {t('premium.premium') || 'Premium'}
                  </CardTitle>
                  <CardDescription>{t('pricing.premiumDesc') || 'For serious job seekers'}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{price}</span>
                    <span className="text-muted-foreground">/{t('premium.perMonth') || 'mo'}</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('premium.billedYearly') || 'Billed yearly'}: {totalPrice}
                    </p>
                  )}
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
                  {isPremium ? (
                    <Button disabled className="w-full h-12">
                      <Check className="w-4 h-4 mr-2" />
                      {t('pricing.currentPlan') || 'Current Plan'}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      onClick={() => {
                        // TODO: Stripe checkout
                        console.log('Upgrade to premium:', billingPeriod);
                      }}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {t('premium.upgradeNow') || 'Upgrade to Premium'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              {t('premium.guarantee') || '7-day money-back guarantee • Cancel anytime'}
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
              {[
                {
                  q: t('pricing.faq1q') || 'Can I cancel anytime?',
                  a: t('pricing.faq1a') || 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
                },
                {
                  q: t('pricing.faq2q') || 'What payment methods do you accept?',
                  a: t('pricing.faq2a') || 'We accept all major credit cards, debit cards, and PayPal through our secure payment processor Stripe.'
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
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
