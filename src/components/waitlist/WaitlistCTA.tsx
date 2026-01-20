import { useState } from 'react';
import { Bell, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WaitlistModal from './WaitlistModal';
import { useSettings } from '@/context/SettingsContext';

interface WaitlistCTAProps {
  variant?: 'default' | 'compact' | 'inline';
  source?: string;
  className?: string;
}

const WaitlistCTA = ({ variant = 'default', source = 'cta', className = '' }: WaitlistCTAProps) => {
  const { t } = useSettings();
  const [showModal, setShowModal] = useState(false);

  if (variant === 'compact') {
    return (
      <>
        <Button 
          size="sm" 
          variant="outline" 
          className={`gap-2 ${className}`}
          onClick={() => setShowModal(true)}
        >
          <Bell className="w-4 h-4" />
          {t('waitlist.joinShort') || 'Join Waitlist'}
        </Button>
        <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} source={source} />
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1 text-primary hover:underline font-medium ${className}`}
        >
          <Bell className="w-3 h-3" />
          {t('waitlist.joinInline') || 'Get notified'}
        </button>
        <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} source={source} />
      </>
    );
  }

  return (
    <>
      <div className={`p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl border border-primary/20 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{t('waitlist.ctaTitle') || 'Premium Coming Soon'}</span>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('waitlist.earlyBird') || 'Early Bird'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t('waitlist.ctaDescription') || 'Join the waitlist for up to 50% off when we launch.'}
            </p>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => setShowModal(true)}
            >
              <Bell className="w-4 h-4" />
              {t('waitlist.join') || 'Join the Waitlist'}
            </Button>
          </div>
        </div>
      </div>
      <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} source={source} />
    </>
  );
};

export default WaitlistCTA;
