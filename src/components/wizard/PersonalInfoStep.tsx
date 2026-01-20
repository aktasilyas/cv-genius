import { motion } from 'framer-motion';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormValidation, ValidationRules } from '@/hooks/useFormValidation';

const PersonalInfoStep = () => {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { t, language } = useSettings();
  const { validateField, markTouched, isTouched } = useFormValidation();
  const { personalInfo } = cvData;

  // Localized placeholders
  const getPlaceholder = (key: string): string => {
    const placeholders: Record<string, Record<string, string>> = {
      fullName: { en: 'John Doe', tr: 'Ahmet Yılmaz', de: 'Max Müller', fr: 'Jean Dupont', es: 'Juan García' },
      title: { en: 'Senior Software Engineer', tr: 'Kıdemli Yazılım Mühendisi', de: 'Senior Software-Ingenieur', fr: 'Ingénieur Logiciel Senior', es: 'Ingeniero de Software Senior' },
      email: { en: 'john@example.com', tr: 'ahmet@ornek.com', de: 'max@beispiel.de', fr: 'jean@exemple.fr', es: 'juan@ejemplo.com' },
      phone: { en: '+1 234 567 890', tr: '+90 5XX XXX XX XX', de: '+49 123 456 789', fr: '+33 1 23 45 67 89', es: '+34 612 345 678' },
      location: { en: 'New York, NY', tr: 'İstanbul, Türkiye', de: 'Berlin, Deutschland', fr: 'Paris, France', es: 'Madrid, España' },
      linkedin: { en: 'linkedin.com/in/johndoe', tr: 'linkedin.com/in/ahmetyilmaz', de: 'linkedin.com/in/maxmuller', fr: 'linkedin.com/in/jeandupont', es: 'linkedin.com/in/juangarcia' },
      website: { en: 'johndoe.com', tr: 'ahmetyilmaz.com', de: 'maxmuller.de', fr: 'jeandupont.fr', es: 'juangarcia.es' },
    };
    return placeholders[key]?.[language] || placeholders[key]?.en || '';
  };

  const fields: Array<{
    key: keyof typeof personalInfo;
    labelKey: string;
    required?: boolean;
    type?: string;
    rules: ValidationRules;
  }> = [
    { 
      key: 'fullName', 
      labelKey: 'field.fullName', 
      required: true,
      rules: { required: true, minLength: 2 }
    },
    { 
      key: 'title', 
      labelKey: 'field.title', 
      required: true,
      rules: { required: true, minLength: 2 }
    },
    { 
      key: 'email', 
      labelKey: 'field.email', 
      type: 'email', 
      required: true,
      rules: { required: true, email: true }
    },
    { 
      key: 'phone', 
      labelKey: 'field.phone', 
      type: 'tel', 
      required: true,
      rules: { required: true, phone: true }
    },
    { 
      key: 'location', 
      labelKey: 'field.location', 
      required: true,
      rules: { required: true }
    },
    { 
      key: 'linkedin', 
      labelKey: 'field.linkedin', 
      rules: {}
    },
    { 
      key: 'website', 
      labelKey: 'field.website', 
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
                placeholder={getPlaceholder(field.key)}
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
