import { motion } from 'framer-motion';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormValidation } from '@/hooks/useFormValidation';

const ExperienceStep = () => {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVContext();
  const { t } = useSettings();
  const { validateField, markTouched, isTouched } = useFormValidation();

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
            {t('builder.experience') || 'Work Experience'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('builder.experienceDesc') || 'Add your professional experience'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addExperience} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('btn.add') || 'Add'}
        </Button>
      </div>

      {cvData.experience.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl bg-secondary/20">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('empty.experience') || 'No experience added yet'}
          </p>
          <Button variant="accent" size="sm" onClick={addExperience}>
            {t('empty.addFirstExperience') || 'Add Your First Experience'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.experience.map((exp, index) => {
            const positionError = validateField(exp.position, { required: true });
            const companyError = validateField(exp.company, { required: true });
            const startDateError = validateField(exp.startDate, { required: true, date: true });
            const endDateError = !exp.current ? validateField(exp.endDate, { date: true }) : null;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border/40 bg-card/50 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <h3 className="font-medium text-sm">
                      {exp.position || exp.company || `${t('builder.experience') || 'Experience'} ${index + 1}`}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.position') || 'Job Title'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Software Engineer"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      onBlur={() => handleBlur(`${exp.id}-position`)}
                      error={positionError || undefined}
                      touched={isTouched(`${exp.id}-position`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.company') || 'Company'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Google"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      onBlur={() => handleBlur(`${exp.id}-company`)}
                      error={companyError || undefined}
                      touched={isTouched(`${exp.id}-company`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.startDate') || 'Start Date'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="month"
                      placeholder="2020-01"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      onBlur={() => handleBlur(`${exp.id}-startDate`)}
                      error={startDateError || undefined}
                      touched={isTouched(`${exp.id}-startDate`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.endDate') || 'End Date'}
                    </Label>
                    <Input
                      type="month"
                      placeholder="2024-01"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      onBlur={() => handleBlur(`${exp.id}-endDate`)}
                      disabled={exp.current}
                      error={endDateError || undefined}
                      touched={isTouched(`${exp.id}-endDate`)}
                    />
                    <div className="flex items-center gap-2 mt-2.5">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`current-${exp.id}`} className="text-xs text-muted-foreground cursor-pointer">
                        {t('field.current') || 'I currently work here'}
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t('field.description') || 'Description & Achievements'}
                  </Label>
                  <Textarea
                    placeholder={t('placeholder.description') || 'Describe your responsibilities and achievements...'}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceStep;
