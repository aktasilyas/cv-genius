import { Globe, Palette, Check, Sun, Moon, Monitor } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { Language, languageNames } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, theme, setTheme, t } = useSettings();

  const languages: Language[] = ['en', 'tr', 'de', 'fr', 'es'];
  const themes = [
    { id: 'light' as const, label: t('settings.themeLight') || 'Light', icon: Sun },
    { id: 'dark' as const, label: t('settings.themeDark') || 'Dark', icon: Moon },
    { id: 'system' as const, label: t('settings.themeSystem') || 'System', icon: Monitor },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-display">{t('settings.title') || 'Settings'}</SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          {/* Language Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('settings.language') || 'Language'}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    language === lang
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{languageNames[lang]}</span>
                  {language === lang && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('settings.theme') || 'Theme'}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === themeOption.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-medium">{themeOption.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="default" className="w-full" onClick={onClose}>
            {t('settings.save') || 'Save Settings'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSidebar;