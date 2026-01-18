import { motion } from 'framer-motion';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfoStep = () => {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { t } = useSettings();
  const { personalInfo } = cvData;

  const fields: Array<{
    key: keyof typeof personalInfo;
    labelKey: string;
    placeholder: string;
    required?: boolean;
    type?: string;
  }> = [
    { key: 'fullName', labelKey: 'field.fullName', placeholder: 'John Doe', required: true },
    { key: 'title', labelKey: 'field.title', placeholder: 'Senior Software Engineer', required: true },
    { key: 'email', labelKey: 'field.email', placeholder: 'john@example.com', type: 'email', required: true },
    { key: 'phone', labelKey: 'field.phone', placeholder: '+1 234 567 890', type: 'tel', required: true },
    { key: 'location', labelKey: 'field.location', placeholder: 'New York, NY', required: true },
    { key: 'linkedin', labelKey: 'field.linkedin', placeholder: 'linkedin.com/in/johndoe' },
    { key: 'website', labelKey: 'field.website', placeholder: 'johndoe.com' },
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
          {t('builder.personalInfo') || 'Personal Information'}
        </h2>
        <p className="text-muted-foreground">
          {t('builder.personalInfoDesc') || "Let's start with your basic details"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.key === 'fullName' || field.key === 'title' ? 'md:col-span-2' : ''}>
            <Label htmlFor={field.key} className="text-sm font-medium">
              {t(field.labelKey) || field.labelKey.split('.')[1]}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={personalInfo[field.key] || ''}
              onChange={(e) => updatePersonalInfo(field.key, e.target.value)}
              className="mt-1.5"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;
