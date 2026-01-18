import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const EducationStep = () => {
  const { cvData, addEducation, updateEducation, removeEducation } = useCVContext();
  const { t } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold mb-2">
            {t('builder.education') || 'Education'}
          </h2>
          <p className="text-muted-foreground">
            {t('builder.educationDesc') || 'Add your educational background'}
          </p>
        </div>
        <Button variant="outline" onClick={addEducation} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('btn.addEducation') || 'Add Education'}
        </Button>
      </div>

      {cvData.education.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">
            {t('empty.education') || 'No education added yet'}
          </p>
          <Button variant="accent" onClick={addEducation}>
            {t('empty.addFirstEducation') || 'Add Your Education'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {t('builder.education') || 'Education'} {index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(edu.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>{t('field.institution') || 'Institution'}</Label>
                  <Input
                    placeholder="Massachusetts Institute of Technology"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{t('field.degree') || 'Degree'}</Label>
                  <Input
                    placeholder="Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{t('field.fieldOfStudy') || 'Field of Study'}</Label>
                  <Input
                    placeholder="Computer Science"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{t('field.startDate') || 'Start Date'}</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{t('field.endDate') || 'End Date'}</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{t('field.gpa') || 'GPA (Optional)'}</Label>
                  <Input
                    placeholder="3.8 / 4.0"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EducationStep;
