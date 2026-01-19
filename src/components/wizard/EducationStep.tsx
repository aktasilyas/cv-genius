import { motion } from 'framer-motion';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFormValidation } from '@/hooks/useFormValidation';

const EducationStep = () => {
  const { cvData, addEducation, updateEducation, removeEducation } = useCVContext();
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
            {t('builder.education') || 'Education'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('builder.educationDesc') || 'Add your educational background'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addEducation} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('btn.add') || 'Add'}
        </Button>
      </div>

      {cvData.education.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl bg-secondary/20">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('empty.education') || 'No education added yet'}
          </p>
          <Button variant="accent" size="sm" onClick={addEducation}>
            {t('empty.addFirstEducation') || 'Add Your Education'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cvData.education.map((edu, index) => {
            const institutionError = validateField(edu.institution, { required: true });
            const degreeError = validateField(edu.degree, { required: true });
            const fieldError = validateField(edu.field, { required: true });
            const startDateError = validateField(edu.startDate, { date: true });
            const endDateError = validateField(edu.endDate, { date: true });

            return (
              <motion.div
                key={edu.id}
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
                      {edu.institution || `${t('builder.education') || 'Education'} ${index + 1}`}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(edu.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.institution') || 'Institution'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Massachusetts Institute of Technology"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      onBlur={() => handleBlur(`${edu.id}-institution`)}
                      error={institutionError || undefined}
                      touched={isTouched(`${edu.id}-institution`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.degree') || 'Degree'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Bachelor of Science"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      onBlur={() => handleBlur(`${edu.id}-degree`)}
                      error={degreeError || undefined}
                      touched={isTouched(`${edu.id}-degree`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.fieldOfStudy') || 'Field of Study'} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Computer Science"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      onBlur={() => handleBlur(`${edu.id}-field`)}
                      error={fieldError || undefined}
                      touched={isTouched(`${edu.id}-field`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.startDate') || 'Start Date'}
                    </Label>
                    <Input
                      type="month"
                      placeholder="2018-09"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      onBlur={() => handleBlur(`${edu.id}-startDate`)}
                      error={startDateError || undefined}
                      touched={isTouched(`${edu.id}-startDate`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.endDate') || 'End Date'}
                    </Label>
                    <Input
                      type="month"
                      placeholder="2022-06"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      onBlur={() => handleBlur(`${edu.id}-endDate`)}
                      error={endDateError || undefined}
                      touched={isTouched(`${edu.id}-endDate`)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {t('field.gpa') || 'GPA'} <span className="text-muted-foreground/60 text-[10px]">({t('field.optional') || 'Optional'})</span>
                    </Label>
                    <Input
                      placeholder="3.8 / 4.0"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default EducationStep;
