import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, User } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFormValidation, ValidationRules } from '@/hooks/useFormValidation';

const PersonalInfoStep = () => {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { t, language } = useSettings();
  const { validateField, markTouched, isTouched } = useFormValidation();
  const { personalInfo } = cvData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updatePersonalInfo('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updatePersonalInfo('photo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

      {/* Photo Upload Section */}
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/30"
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          {personalInfo.photo && (
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
              title={t('field.removePhoto') || 'Remove photo'}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <Label className="text-sm font-medium mb-1 block">
            {t('field.photo') || 'Profile Photo'}
          </Label>
          <p className="text-xs text-muted-foreground mb-2">
            {t('field.photoDesc') || 'Optional. Max 2MB, JPG or PNG'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            {personalInfo.photo
              ? (t('field.changePhoto') || 'Change Photo')
              : (t('field.uploadPhoto') || 'Upload Photo')
            }
          </Button>
        </div>
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
