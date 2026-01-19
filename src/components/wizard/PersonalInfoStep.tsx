import { motion } from 'framer-motion';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormValidation, ValidationRules } from '@/hooks/useFormValidation';

const PersonalInfoStep = () => {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { t } = useSettings();
  const { validateField, markTouched, isTouched } = useFormValidation();
  const { personalInfo } = cvData;

  const fields: Array<{
    key: keyof typeof personalInfo;
    labelKey: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    rules: ValidationRules;
  }> = [
    { 
      key: 'fullName', 
      labelKey: 'field.fullName', 
      placeholder: 'John Doe', 
      required: true,
      rules: { required: true, minLength: 2 }
    },
    { 
      key: 'title', 
      labelKey: 'field.title', 
      placeholder: 'Senior Software Engineer', 
      required: true,
      rules: { required: true, minLength: 2 }
    },
    { 
      key: 'email', 
      labelKey: 'field.email', 
      placeholder: 'john@example.com', 
      type: 'email', 
      required: true,
      rules: { required: true, email: true }
    },
    { 
      key: 'phone', 
      labelKey: 'field.phone', 
      placeholder: '+1 234 567 890', 
      type: 'tel', 
      required: true,
      rules: { required: true, phone: true }
    },
    { 
      key: 'location', 
      labelKey: 'field.location', 
      placeholder: 'New York, NY', 
      required: true,
      rules: { required: true }
    },
    { 
      key: 'linkedin', 
      labelKey: 'field.linkedin', 
      placeholder: 'linkedin.com/in/johndoe',
      rules: {}
    },
    { 
      key: 'website', 
      labelKey: 'field.website', 
      placeholder: 'johndoe.com',
      rules: {}
    },
  ];

  const handleBlur = (fieldKey: string) => {
    markTouched(fieldKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-display font-semibold mb-1">
          {t('builder.personalInfo') || 'Personal Information'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('builder.personalInfoDesc') || "Let's start with your basic details"}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => {
          const value = personalInfo[field.key] || '';
          const error = validateField(value, field.rules);
          const touched = isTouched(field.key);

          return (
            <div key={field.key} className={field.key === 'fullName' || field.key === 'title' ? 'md:col-span-2' : ''}>
              <Label htmlFor={field.key} className="text-sm font-medium mb-2 block">
                {t(field.labelKey) || field.labelKey.split('.')[1]}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Input
                id={field.key}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => updatePersonalInfo(field.key, e.target.value)}
                onBlur={() => handleBlur(field.key)}
                error={error || undefined}
                touched={touched}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;
