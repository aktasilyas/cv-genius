import { motion } from 'framer-motion';
import { History, RotateCcw, Clock, Tag } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { tr, de, fr, es, enUS, type Locale } from 'date-fns/locale';

const locales: Record<string, Locale> = {
  tr,
  de,
  fr,
  es,
  en: enUS
};

const VersionHistoryPanel = () => {
  const { versions, restoreVersion, saveVersion } = useCVContext();
  const { t, language } = useSettings();

  const handleSaveVersion = () => {
    const label = prompt(t('version.labelPrompt') || 'Enter a label for this version:');
    if (label) {
      saveVersion(label);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('version.title') || 'Version History'}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleSaveVersion}>
          <Tag className="w-4 h-4" />
          {t('version.save') || 'Save Version'}
        </Button>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('version.empty') || 'No saved versions yet'}</p>
          <p className="text-xs mt-1">{t('version.emptyHint') || 'Save a version to track changes'}</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">{version.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(version.timestamp), { 
                      addSuffix: true,
                      locale: locales[language] || enUS
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => restoreVersion(version.id)}
              >
                <RotateCcw className="w-4 h-4" />
                {t('version.restore') || 'Restore'}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryPanel;
