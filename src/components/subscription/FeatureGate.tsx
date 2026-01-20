import { ReactNode, useState } from 'react';
import { useSubscriptionContext } from '@/context/SubscriptionContext';
import { PlanFeatures } from '@/types/subscription';
import UpgradeModal from './UpgradeModal';
import PremiumBadge from './PremiumBadge';
import { useSettings } from '@/context/SettingsContext';

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  featureName?: string;
  children: ReactNode;
  fallback?: ReactNode;
  showLock?: boolean;
}

const FeatureGate = ({ 
  feature, 
  featureName, 
  children, 
  fallback,
  showLock = true 
}: FeatureGateProps) => {
  const { canUseFeature, isPremium, isLoading } = useSubscriptionContext();
  const { t } = useSettings();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // While loading, show children (optimistic)
  if (isLoading) {
    return <>{children}</>;
  }

  // Premium users get full access
  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  // Free users see fallback or locked state
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked state
  return (
    <>
      <div 
        className="relative cursor-pointer group"
        onClick={() => setShowUpgrade(true)}
      >
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        {showLock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="text-center p-4">
              <PremiumBadge type="lock" size="lg" showTooltip={false} className="mx-auto mb-2" />
              <p className="text-sm font-medium">{t('premium.unlockFeature') || 'Unlock with Premium'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('premium.clickToUpgrade') || 'Click to upgrade'}
              </p>
            </div>
          </div>
        )}
      </div>
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        feature={featureName}
      />
    </>
  );
};

export default FeatureGate;
