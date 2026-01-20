import { Crown, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSettings } from '@/context/SettingsContext';

interface PremiumBadgeProps {
  type?: 'badge' | 'icon' | 'lock';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const PremiumBadge = ({ 
  type = 'badge', 
  size = 'sm', 
  showTooltip = true,
  className = '' 
}: PremiumBadgeProps) => {
  const { t } = useSettings();

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const content = () => {
    if (type === 'lock') {
      return (
        <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 ${className}`}>
          <Lock className={`${sizeClasses[size]} text-primary`} />
        </div>
      );
    }

    if (type === 'icon') {
      return <Crown className={`${sizeClasses[size]} text-amber-500 ${className}`} />;
    }

    return (
      <Badge 
        variant="outline" 
        className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 gap-1 ${className}`}
      >
        <Crown className="w-3 h-3" />
        <span className="text-[10px] font-medium">PREMIUM</span>
      </Badge>
    );
  };

  if (!showTooltip) {
    return content();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content()}
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('premium.required') || 'Premium feature'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumBadge;
