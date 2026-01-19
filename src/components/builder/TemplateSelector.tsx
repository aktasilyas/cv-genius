import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Settings2, Maximize2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { CVTemplate } from '@/types/cv';
import TemplateCustomizationModal from './TemplateCustomizationModal';

interface TemplateSelectorProps {
  compact?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ compact = false }) => {
  const { selectedTemplate, setSelectedTemplate } = useCVContext();
  const { t } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate>('modern');

  const handleTemplateClick = (templateId: CVTemplate) => {
    setPreviewTemplate(templateId);
    setModalOpen(true);
  };

  const templates: { id: CVTemplate; name: string; description: string; preview: React.ReactNode }[] = [
    {
      id: 'modern',
      name: t('template.modern'),
      description: t('template.modernDesc'),
      preview: (
        <div className="font-sans bg-white p-6 h-full">
          {/* Header */}
          <div className="flex gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">John Smith</h1>
              <p className="text-teal-600 font-medium text-sm mb-3">Senior Software Engineer</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> john@email.com</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +1 234 567</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> New York</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full" />
          </div>
          
          {/* Summary */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="h-2 w-full bg-gray-100 rounded mb-1" />
            <div className="h-2 w-4/5 bg-gray-100 rounded" />
          </div>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-sm">Experience</span>
              </div>
              <div className="ml-6 space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-3/4 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-gray-700 mb-2">Skills</div>
              <div className="space-y-1">
                <div className="h-2 w-full bg-teal-200 rounded" />
                <div className="h-2 w-4/5 bg-teal-200 rounded" />
                <div className="h-2 w-3/5 bg-teal-200 rounded" />
              </div>
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
        <div className="font-serif bg-white p-6 h-full text-center">
          {/* Centered Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide mb-1">JANE WILLIAMS</h1>
            <p className="text-gray-600 italic text-sm mb-2">Marketing Director</p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>jane@email.com</span>
              <span>•</span>
              <span>+1 234 567</span>
              <span>•</span>
              <span>Boston, MA</span>
            </div>
          </div>
          
          {/* Professional Summary */}
          <div className="mb-4 text-left">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
            <div className="space-y-1">
              <div className="h-2 w-full bg-gray-100 rounded" />
              <div className="h-2 w-5/6 bg-gray-100 rounded" />
            </div>
          </div>
          
          {/* Experience */}
          <div className="text-left">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h2>
            <div className="space-y-1">
              <div className="h-2 w-1/2 bg-gray-200 rounded" />
              <div className="h-2 w-full bg-gray-100 rounded" />
              <div className="h-2 w-4/5 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'minimal',
      name: t('template.minimal'),
      description: t('template.minimalDesc'),
      preview: (
        <div className="font-sans bg-white p-6 h-full">
          {/* Simple Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-light text-gray-900 mb-1">Alex Chen</h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">Product Designer</p>
          </div>
          
          {/* Contact - Minimal */}
          <div className="flex gap-6 text-xs text-gray-400 mb-6 pb-6 border-b border-gray-100">
            <span>alex@email.com</span>
            <span>portfolio.com</span>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">About</h2>
              <div className="h-2 w-full bg-gray-50 rounded mb-1" />
              <div className="h-2 w-3/4 bg-gray-50 rounded" />
            </div>
            <div>
              <h2 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">Work</h2>
              <div className="h-2 w-full bg-gray-50 rounded mb-1" />
              <div className="h-2 w-5/6 bg-gray-50 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'creative',
      name: t('template.creative'),
      description: t('template.creativeDesc'),
      preview: (
        <div className="bg-white h-full overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">Sarah Johnson</h1>
            <p className="text-white/80 text-sm">Creative Director</p>
          </div>
          
          {/* Two Column */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-900 text-white p-4">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-purple-400 mb-2">CONTACT</h3>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-gray-700 rounded" />
                  <div className="h-1.5 w-4/5 bg-gray-700 rounded" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-pink-400 mb-2">SKILLS</h3>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-purple-500/50 rounded" />
                  <div className="h-1.5 w-3/4 bg-pink-500/50 rounded" />
                  <div className="h-1.5 w-5/6 bg-orange-500/50 rounded" />
                </div>
              </div>
            </div>
            
            {/* Main */}
            <div className="w-2/3 p-4">
              <h3 className="text-xs font-bold text-gray-800 mb-2">EXPERIENCE</h3>
              <div className="space-y-1">
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-4/5 bg-gray-100 rounded" />
                <div className="h-2 w-3/4 bg-gray-100 rounded" />
              </div>
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
        <div className="bg-white h-full overflow-hidden">
          {/* Executive Header */}
          <div className="bg-slate-800 p-6 text-center">
            <h1 className="text-xl font-bold text-white tracking-wide mb-1">MICHAEL BROWN</h1>
            <div className="w-12 h-0.5 bg-amber-500 mx-auto my-2" />
            <p className="text-amber-400 text-sm font-medium">Chief Executive Officer</p>
            <div className="flex justify-center gap-4 mt-3 text-xs text-slate-300">
              <span>michael@corp.com</span>
              <span>|</span>
              <span>LinkedIn</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-amber-500" />
                <h2 className="text-sm font-bold text-slate-800">EXECUTIVE SUMMARY</h2>
              </div>
              <div className="ml-3 space-y-1">
                <div className="h-2 w-full bg-slate-100 rounded" />
                <div className="h-2 w-5/6 bg-slate-100 rounded" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-amber-500" />
                <h2 className="text-sm font-bold text-slate-800">LEADERSHIP</h2>
              </div>
              <div className="ml-3 space-y-1">
                <div className="h-2 w-full bg-slate-100 rounded" />
                <div className="h-2 w-4/5 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical',
      name: t('template.technical'),
      description: t('template.technicalDesc'),
      preview: (
        <div className="font-mono bg-white h-full p-4">
          {/* Tech Header */}
          <div className="flex justify-between items-start border-b-2 border-blue-600 pb-3 mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">David Lee</h1>
              <p className="text-blue-600 text-sm">Full Stack Developer</p>
            </div>
            <div className="text-right text-xs text-gray-500 space-y-1">
              <div>david@dev.io</div>
              <div>github.com/david</div>
            </div>
          </div>
          
          {/* Two Column Tech Layout */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-3 h-3 text-blue-600" />
                <h2 className="text-xs font-bold">EXPERIENCE</h2>
              </div>
              <div className="bg-gray-50 rounded p-2 space-y-1">
                <div className="h-1.5 w-1/3 bg-gray-300 rounded" />
                <div className="h-1.5 w-full bg-gray-200 rounded" />
                <div className="h-1.5 w-4/5 bg-gray-200 rounded" />
              </div>
            </div>
            
            <div className="bg-slate-900 rounded p-2 text-white">
              <h3 className="text-xs font-bold text-blue-400 mb-2">TECH STACK</h3>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-blue-500 rounded" />
                <div className="h-1.5 w-4/5 bg-blue-400 rounded" />
                <div className="h-1.5 w-3/5 bg-blue-300 rounded" />
                <div className="h-1.5 w-4/5 bg-green-400 rounded" />
                <div className="h-1.5 w-2/3 bg-yellow-400 rounded" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (compact) {
    return (
      <>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTemplateClick(template.id)}
              className={`group relative flex-shrink-0 w-32 text-left p-2 rounded-xl border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-accent bg-accent/5 shadow-lg'
                  : 'border-border hover:border-accent/50 hover:shadow-md'
              }`}
            >
              {selectedTemplate === template.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center z-10"
                >
                  <Check className="w-3 h-3 text-accent-foreground" />
                </motion.div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-2 top-2 bottom-8 bg-black/0 group-hover:bg-black/40 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                <div className="flex items-center gap-1 text-white text-xs font-medium">
                  <Maximize2 className="w-3 h-3" />
                  Önizle
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-24 mb-2 border border-gray-100">
                <div className="transform scale-[0.08] origin-top-left" style={{ width: '1250%', height: '1250%' }}>
                  {template.preview}
                </div>
              </div>
              <h4 className="text-xs font-medium truncate text-center">{template.name}</h4>
            </motion.button>
          ))}
        </div>
        
        <TemplateCustomizationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          templateId={previewTemplate}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTemplateClick(template.id)}
            className={`group relative text-left p-3 md:p-4 rounded-xl border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-accent bg-accent/5 shadow-xl'
                : 'border-border hover:border-accent/50 hover:shadow-lg'
            }`}
          >
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center z-20"
              >
                <Check className="w-4 h-4 text-accent-foreground" />
              </motion.div>
            )}
            
            {/* Hover overlay with actions */}
            <div className="absolute inset-3 md:inset-4 top-3 md:top-4 bottom-16 md:bottom-20 bg-black/0 group-hover:bg-black/50 rounded-lg transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 z-10 gap-2">
              <div className="flex items-center gap-2 text-white font-medium">
                <Maximize2 className="w-4 h-4" />
                Büyük Önizle
              </div>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <Settings2 className="w-3 h-3" />
                Özelleştir
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-3 h-48 md:h-56 border border-gray-100">
              <div className="transform scale-[0.12] origin-top-left" style={{ width: '833%', height: '833%' }}>
                {template.preview}
              </div>
            </div>
            
            <h4 className="font-semibold text-sm md:text-base">{template.name}</h4>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{template.description}</p>
          </motion.button>
        ))}
      </div>
      
      <TemplateCustomizationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        templateId={previewTemplate}
      />
    </>
  );
};

export default TemplateSelector;
