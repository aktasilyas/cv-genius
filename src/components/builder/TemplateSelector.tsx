import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { CVTemplate } from '@/types/cv';

interface TemplateSelectorProps {
  compact?: boolean;
}

const templates: { id: CVTemplate; name: string; description: string }[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean layout with teal accents and sidebar'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif typography with elegant styling'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and refined with generous whitespace'
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ compact = false }) => {
  const { selectedTemplate, setSelectedTemplate } = useCVContext();

  return (
    <div className={compact ? 'flex gap-3' : 'grid md:grid-cols-3 gap-6'}>
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
          
          {/* Template Preview */}
          <div className={`bg-white rounded-lg shadow-sm overflow-hidden mb-3 ${compact ? 'h-24' : 'h-40'}`}>
            <div className="p-2 transform scale-[0.15] origin-top-left" style={{ width: '600%', height: '600%' }}>
              {template.id === 'modern' && (
                <div className="font-sans">
                  <div className="border-b-2 border-teal-500 pb-4 mb-4">
                    <div className="h-6 w-32 bg-gray-800 rounded mb-2" />
                    <div className="h-4 w-24 bg-teal-500 rounded mb-3" />
                    <div className="flex gap-2">
                      <div className="h-3 w-20 bg-gray-300 rounded" />
                      <div className="h-3 w-20 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-3">
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-teal-100 rounded" />
                      <div className="h-2 w-full bg-teal-100 rounded" />
                    </div>
                  </div>
                </div>
              )}
              {template.id === 'classic' && (
                <div className="font-serif text-center">
                  <div className="border-b-2 border-gray-800 pb-4 mb-4">
                    <div className="h-8 w-48 bg-gray-800 rounded mx-auto mb-2" />
                    <div className="h-4 w-32 bg-gray-400 rounded mx-auto mb-3" />
                    <div className="flex justify-center gap-2">
                      <div className="h-3 w-20 bg-gray-300 rounded" />
                      <div className="h-3 w-20 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="h-4 w-28 bg-gray-700 rounded" />
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
              )}
              {template.id === 'minimal' && (
                <div className="font-sans">
                  <div className="mb-4">
                    <div className="h-8 w-40 bg-gray-700 rounded mb-1" />
                    <div className="h-3 w-24 bg-gray-400 rounded mb-2" />
                    <div className="flex gap-1">
                      <div className="h-2 w-16 bg-gray-300 rounded" />
                      <div className="h-2 w-16 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="border-l-2 border-gray-200 pl-3 space-y-2">
                    <div className="h-2 w-full bg-gray-200 rounded" />
                    <div className="h-2 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <h4 className="font-semibold">{template.name}</h4>
          {!compact && <p className="text-sm text-muted-foreground">{template.description}</p>}
        </motion.button>
      ))}
    </div>
  );
};

export default TemplateSelector;
