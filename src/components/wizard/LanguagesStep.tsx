import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguagesStep = () => {
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useCVContext();
  const { t } = useSettings();

  const proficiencyLevels = [
    { value: 'basic', label: t('proficiency.basic') || 'Basic' },
    { value: 'conversational', label: t('proficiency.conversational') || 'Conversational' },
    { value: 'professional', label: t('proficiency.professional') || 'Professional' },
    { value: 'native', label: t('proficiency.native') || 'Native' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">
          {t('builder.languages') || 'Languages'}
        </h2>
        <p className="text-muted-foreground">
          {t('builder.languagesDesc') || 'Add languages you speak'}
        </p>
      </div>

      <div className="space-y-4">
        {cvData.languages.map((lang, index) => (
          <motion.div
            key={lang.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border group"
          >
            <div className="flex-1">
              <Label htmlFor={`lang-name-${lang.id}`}>
                {t('field.language') || 'Language'}
              </Label>
              <Input
                id={`lang-name-${lang.id}`}
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder={t('field.languagePlaceholder') || 'English'}
                className="mt-1.5"
              />
            </div>

            <div className="w-48">
              <Label>{t('field.proficiency') || 'Proficiency'}</Label>
              <Select
                value={lang.proficiency}
                onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg">
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive mt-6"
              onClick={() => removeLanguage(lang.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addLanguage}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4" />
        {t('btn.addLanguage') || 'Add Language'}
      </Button>
    </motion.div>
  );
};

export default LanguagesStep;
