import { ReactNode, useState } from 'react';
import { useSubscriptionContext } from '@/context/SubscriptionContext';
import { PlanFeatures } from '@/types/subscription';
import { isWaitlistMode } from '@/types/waitlist';
import WaitlistModal from '@/components/waitlist/WaitlistModal';
import PremiumBadge from './PremiumBadge';
import { useSettings } from '@/context/SettingsContext';

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  featureName?: string;
  children: ReactNode;
  fallback?: ReactNode;
  showLock?: boolean;
  source?: string;
}

const FeatureGate = ({ 
  feature, 
  featureName, 
  children, 
  fallback,
  showLock = true,
  source = 'feature-gate'
}: FeatureGateProps) => {
  const { canUseFeature, isLoading } = useSubscriptionContext();
  const { t } = useSettings();
  const [showWaitlist, setShowWaitlist] = useState(false);

  // While loading, show children (optimistic)
  if (isLoading) {
    return <>{children}</>;
  }

  // In non-waitlist mode, check subscription
  // In waitlist mode, everyone gets access to try features (except PDF export)
  if (!isWaitlistMode() && canUseFeature(feature)) {
    return <>{children}</>;
  }

  // In waitlist mode, allow most features for MVP testing
  if (isWaitlistMode()) {
    // Only restrict watermarkFree (PDF export) in waitlist mode
    if (feature !== 'watermarkFree') {
      return <>{children}</>;
    }
  }

  // Free users see fallback or locked state
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked state with waitlist modal
  return (
    <>
      <div 
        className="relative cursor-pointer group"
        onClick={() => setShowWaitlist(true)}
      >
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        {showLock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="text-center p-4">
              <PremiumBadge type="lock" size="lg" showTooltip={false} className="mx-auto mb-2" />
              <p className="text-sm font-medium">
                {isWaitlistMode() 
                  ? (t('waitlist.comingSoonShort') || 'Coming Soon')
                  : (t('premium.unlockFeature') || 'Unlock with Premium')
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isWaitlistMode()
                  ? (t('waitlist.clickToJoin') || 'Click to get early access')
                  : (t('premium.clickToUpgrade') || 'Click to upgrade')
                }
              </p>
            </div>
          </div>
        )}
      </div>
      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
        feature={featureName}
        source={source}
      />
    </>
  );
};

export default FeatureGate;
