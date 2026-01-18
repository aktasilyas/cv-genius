import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { CVTemplate } from '@/types/cv';

interface TemplateSelectorProps {
  compact?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ compact = false }) => {
  const { selectedTemplate, setSelectedTemplate } = useCVContext();
  const { t } = useSettings();

  const templates: { id: CVTemplate; name: string; description: string; preview: React.ReactNode }[] = [
    {
      id: 'modern',
      name: t('template.modern'),
      description: t('template.modernDesc'),
      preview: (
        <div className="font-sans">
          <div className="border-b-2 border-teal-500 pb-4 mb-4">
            <div className="h-6 w-32 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-24 bg-teal-500 rounded mb-3" />
            <div className="flex gap-2">
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-3 w-20 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'classic',
      name: t('template.classic'),
      description: t('template.classicDesc'),
      preview: (
        <div className="font-serif text-center">
          <div className="border-b-2 border-gray-800 pb-4 mb-4">
            <div className="h-8 w-48 bg-gray-800 rounded mx-auto mb-2" />
            <div className="h-4 w-32 bg-gray-400 rounded mx-auto mb-3" />
          </div>
        </div>
      )
    },
    {
      id: 'minimal',
      name: t('template.minimal'),
      description: t('template.minimalDesc'),
      preview: (
        <div className="font-sans">
          <div className="mb-4">
            <div className="h-8 w-40 bg-gray-700 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-400 rounded mb-2" />
          </div>
        </div>
      )
    },
    {
      id: 'creative',
      name: t('template.creative'),
      description: t('template.creativeDesc'),
      preview: (
        <div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-16 rounded-t" />
          <div className="grid grid-cols-3 mt-2">
            <div className="bg-gray-900 h-20 rounded-bl" />
            <div className="col-span-2 p-2">
              <div className="h-3 w-full bg-gray-200 rounded mb-2" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'executive',
      name: t('template.executive'),
      description: t('template.executiveDesc'),
      preview: (
        <div>
          <div className="bg-slate-800 p-3 text-center rounded-t">
            <div className="h-4 w-24 bg-white/80 rounded mx-auto mb-1" />
            <div className="h-0.5 w-8 bg-amber-500 mx-auto my-1" />
            <div className="h-2 w-16 bg-amber-500/50 rounded mx-auto" />
          </div>
          <div className="p-2">
            <div className="h-2 w-full bg-gray-200 rounded mb-1" />
            <div className="h-2 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      )
    },
    {
      id: 'technical',
      name: t('template.technical'),
      description: t('template.technicalDesc'),
      preview: (
        <div className="font-mono">
          <div className="flex justify-between border-b-2 border-blue-600 pb-2 mb-2">
            <div className="h-5 w-24 bg-gray-800 rounded" />
            <div className="space-y-1">
              <div className="h-2 w-20 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 bg-gray-100 p-2 rounded">
              <div className="h-2 w-full bg-gray-300 rounded mb-1" />
              <div className="h-2 w-3/4 bg-gray-300 rounded" />
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <div className="h-2 w-full bg-blue-500 rounded mb-1" />
              <div className="h-2 w-2/3 bg-blue-500/50 rounded" />
            </div>
          </div>
        </div>
      )
    }
  ];

  if (compact) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTemplate(template.id)}
            className={`relative flex-shrink-0 w-28 text-left p-3 rounded-xl border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-accent-foreground" />
              </motion.div>
            )}
            <div className="bg-white rounded shadow-sm overflow-hidden h-16 mb-2">
              <div className="p-1 transform scale-[0.12] origin-top-left" style={{ width: '800%', height: '800%' }}>
                {template.preview}
              </div>
            </div>
            <h4 className="text-xs font-medium truncate">{template.name}</h4>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <motion.button
          key={template.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedTemplate(template.id)}
          className={`relative text-left p-4 rounded-xl border-2 transition-all ${
            selectedTemplate === template.id
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50'
          }`}
        >
          {selectedTemplate === template.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-accent-foreground" />
            </motion.div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3 h-40">
            <div className="p-2 transform scale-[0.15] origin-top-left" style={{ width: '600%', height: '600%' }}>
              {template.preview}
            </div>
          </div>
          
          <h4 className="font-semibold">{template.name}</h4>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </motion.button>
      ))}
    </div>
  );
};

export default TemplateSelector;
