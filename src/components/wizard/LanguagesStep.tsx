import { motion } from 'framer-motion';
import { Plus, Trash2, Languages } from 'lucide-react';
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
import { useFormValidation } from '@/hooks/useFormValidation';

const LanguagesStep = () => {
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useCVContext();
  const { t } = useSettings();
  const { validateField, markTouched, isTouched } = useFormValidation();

  const proficiencyLevels = [
    { value: 'basic', label: t('proficiency.basic') || 'Basic', color: 'bg-slate-400' },
    { value: 'conversational', label: t('proficiency.conversational') || 'Conversational', color: 'bg-blue-400' },
    { value: 'professional', label: t('proficiency.professional') || 'Professional', color: 'bg-emerald-400' },
    { value: 'native', label: t('proficiency.native') || 'Native', color: 'bg-amber-400' },
  ];

  const getLevelColor = (level: string) => {
    return proficiencyLevels.find(l => l.value === level)?.color || 'bg-slate-400';
  };

  const handleBlur = (fieldId: string) => {
    markTouched(fieldId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold mb-1">
            {t('builder.languages') || 'Languages'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('builder.languagesDesc') || 'Add languages you speak'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addLanguage} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('btn.add') || 'Add'}
        </Button>
      </div>

      {cvData.languages.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl bg-secondary/20">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Languages className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('empty.languages') || 'No languages added yet'}
          </p>
          <Button variant="accent" size="sm" onClick={addLanguage}>
            {t('empty.addFirstLanguage') || 'Add Your First Language'}
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {cvData.languages.map((lang, index) => {
            const nameError = validateField(lang.name, { required: true });
            
            return (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="group relative rounded-xl border border-border/40 bg-card/50 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Level indicator */}
                  <div className={`w-1.5 h-full min-h-[60px] rounded-full ${getLevelColor(lang.proficiency)}`} />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        {t('field.language') || 'Language'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                        onBlur={() => handleBlur(`${lang.id}-name`)}
                        placeholder={t('field.languagePlaceholder') || 'English'}
                        error={nameError || undefined}
                        touched={isTouched(`${lang.id}-name`)}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        {t('field.proficiency') || 'Proficiency'}
                      </Label>
                      <Select
                        value={lang.proficiency}
                        onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-2 border-border/40 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg rounded-xl">
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value} className="rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${level.color}`} />
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeLanguage(lang.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default LanguagesStep;
