import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Eye, EyeOff, GripVertical, Layers } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { SectionOrder } from '@/types/cv';

const sectionIcons: Record<string, string> = {
  summary: '📝',
  experience: '💼',
  education: '🎓',
  skills: '⚡',
  languages: '🌍',
  certificates: '🏆',
};

const SectionControlPanel = () => {
  const { cvData, toggleSectionVisibility, updateSectionOrder } = useCVContext();
  const { t } = useSettings();
  const [items, setItems] = useState(cvData.sectionOrder);

  const getSectionLabel = (id: string) => {
    const labels: Record<string, string> = {
      summary: t('builder.summary') || 'Summary',
      experience: t('builder.experience') || 'Experience',
      education: t('builder.education') || 'Education',
      skills: t('builder.skills') || 'Skills',
      languages: t('builder.languages') || 'Languages',
      certificates: t('builder.certificates') || 'Certificates',
    };
    return labels[id] || id;
  };

  const handleReorder = (newItems: SectionOrder[]) => {
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));
    setItems(updatedItems);
    updateSectionOrder(updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">{t('section.title') || 'Section Controls'}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {t('section.description') || 'Toggle visibility and drag to reorder sections'}
      </p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((item) => {
          const sectionKey = item.id as keyof typeof cvData.sectionVisibility;
          const isVisible = cvData.sectionVisibility[sectionKey];

          return (
            <Reorder.Item
              key={item.id}
              value={item}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                layout
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isVisible 
                    ? 'bg-background border-border hover:border-accent/50' 
                    : 'bg-secondary/30 border-transparent opacity-60'
                }`}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                
                <span className="text-lg">{sectionIcons[item.id]}</span>
                
                <span className="flex-1 font-medium text-sm">
                  {getSectionLabel(item.id)}
                </span>

                <div className="flex items-center gap-2">
                  {isVisible ? (
                    <Eye className="w-4 h-4 text-accent" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={isVisible}
                    onCheckedChange={() => toggleSectionVisibility(sectionKey)}
                  />
                </div>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <p className="text-xs text-muted-foreground text-center">
        {t('section.hint') || 'Hidden sections will not appear in your CV'}
      </p>
    </div>
  );
};

export default SectionControlPanel;
