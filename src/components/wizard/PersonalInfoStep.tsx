import { motion } from 'framer-motion';
import { useCVContext } from '@/context/CVContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfoStep = () => {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { personalInfo } = cvData;

  const fields: Array<{
    key: keyof typeof personalInfo;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
  }> = [
    { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', required: true },
    { key: 'title', label: 'Professional Title', placeholder: 'Senior Software Engineer', required: true },
    { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email', required: true },
    { key: 'phone', label: 'Phone', placeholder: '+1 234 567 890', type: 'tel', required: true },
    { key: 'location', label: 'Location', placeholder: 'New York, NY', required: true },
    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe' },
    { key: 'website', label: 'Personal Website', placeholder: 'johndoe.com' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">Let's start with your basic details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.key === 'fullName' || field.key === 'title' ? 'md:col-span-2' : ''}>
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
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
