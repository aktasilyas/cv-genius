import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Settings2, Maximize2, Crown, Lock,
  Layers, Filter, Code, Palette, BookOpen, User, Building, Sparkles, Github, Linkedin
} from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { useSubscriptionContext } from '@/context/SubscriptionContext';
import { CVTemplate } from '@/types/cv';
import { isWaitlistMode } from '@/types/waitlist';
import TemplateCustomizationModal from './TemplateCustomizationModal';
import WaitlistModal from '@/components/waitlist/WaitlistModal';
import PremiumBadge from '@/components/subscription/PremiumBadge';
import { templateMetadata, TemplateCategory, CVTemplateType } from '@/presentation/components/templates/templateLoader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TemplateSelectorProps {
  compact?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ compact = false }) => {
  const { selectedTemplate, setSelectedTemplate } = useCVContext();
  const { t } = useSettings();
  const { canUseTemplate, isPremium } = useSubscriptionContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate>('modern');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [lockedTemplateName, setLockedTemplateName] = useState('');
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [layoutFilter, setLayoutFilter] = useState<'all' | 'single-column' | 'two-column'>('all');

  const handleTemplateClick = (templateId: CVTemplate, templateName: string) => {
    if (!isWaitlistMode() && !canUseTemplate(templateId)) {
      setLockedTemplateName(templateName);
      setShowWaitlist(true);
      return;
    }
    setPreviewTemplate(templateId);
    setModalOpen(true);
  };

  const isTemplateLocked = (templateId: CVTemplate): boolean => {
    if (isWaitlistMode()) return false;
    return !canUseTemplate(templateId);
  };

  // Filter templates based on category and layout
  const filteredTemplates = useMemo(() => {
    return templateMetadata.filter(t => {
      const categoryMatch = activeCategory === 'all' || t.category === activeCategory;
      const layoutMatch = layoutFilter === 'all' || t.layout === layoutFilter;
      return categoryMatch && layoutMatch;
    });
  }, [activeCategory, layoutFilter]);

  // Category tabs
  const categories: { id: TemplateCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('template.category.all') || 'All', icon: <Layers className="w-4 h-4" /> },
    { id: 'professional', label: t('template.category.professional') || 'Professional', icon: <Building className="w-4 h-4" /> },
    { id: 'creative', label: t('template.category.creative') || 'Creative', icon: <Palette className="w-4 h-4" /> },
    { id: 'academic', label: t('template.category.academic') || 'Academic', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'entry-level', label: t('template.category.entryLevel') || 'Entry Level', icon: <User className="w-4 h-4" /> },
  ];

  // Sample preview components for each template
  const getTemplatePreview = (templateId: CVTemplateType) => {
    const meta = templateMetadata.find(t => t.id === templateId);
    const primaryColor = meta?.defaultColors.primary || '#0d9488';
    const accentColor = meta?.defaultColors.accent || '#14b8a6';

    switch (templateId) {
      case 'modern':
        return (
          <div className="font-sans bg-white p-6 h-full">
            <div className="flex gap-6 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">John Smith</h1>
                <p className="font-medium text-sm mb-3" style={{ color: primaryColor }}>Senior Software Engineer</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> john@email.com</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +1 234 567</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="font-semibold text-sm">{t('cv.experience')}</span>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-3/4 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-700 mb-2">{t('cv.skills')}</div>
                <div className="space-y-1">
                  <div className="h-2 w-full rounded" style={{ backgroundColor: `${primaryColor}30` }} />
                  <div className="h-2 w-4/5 rounded" style={{ backgroundColor: `${primaryColor}30` }} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'berlin':
        return (
          <div className="font-sans bg-white p-6 h-full">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>David Chen</h1>
              <p className="text-sm mb-2" style={{ color: accentColor }}>Full Stack Developer</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: accentColor }} /> dev@email.com</span>
                <span className="flex items-center gap-1"><Github className="w-3 h-3" style={{ color: accentColor }} /> github.com/david</span>
                <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: accentColor }} /> linkedin.com/in/david</span>
              </div>
            </div>
            <div className="h-0.5 w-full mb-4" style={{ backgroundColor: primaryColor }} />
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {['React', 'Node.js', 'TypeScript', 'AWS'].map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${accentColor}20`, color: primaryColor }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>Experience</h2>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-4/5 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'manhattan':
        return (
          <div className="font-serif bg-white p-6 h-full">
            <div className="text-center border-b-2 pb-4 mb-4" style={{ borderColor: primaryColor }}>
              <h1 className="text-2xl font-bold tracking-wider mb-1" style={{ color: primaryColor }}>MICHAEL ROSS</h1>
              <p className="text-sm italic mb-2" style={{ color: accentColor }}>Senior Investment Analyst</p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>michael@corp.com</span>
                <span>•</span>
                <span>+1 234 567</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest pb-1 mb-2" style={{ borderBottom: `1px solid ${primaryColor}`, color: primaryColor }}>
                  Experience
                </h2>
                <p className="text-sm">Managed portfolio worth <strong style={{ color: primaryColor }}>$50M</strong> with <strong style={{ color: primaryColor }}>23%</strong> annual returns</p>
              </div>
              <div className="p-3 border" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}>
                <h3 className="text-xs font-bold mb-2" style={{ color: primaryColor }}>
                  <Award className="w-3 h-3 inline mr-1" style={{ color: accentColor }} />
                  Certifications
                </h3>
                <div className="text-xs text-gray-600">CFA Level III • Series 7 • Bloomberg Terminal</div>
              </div>
            </div>
          </div>
        );

      case 'stockholm':
        return (
          <div className="h-full flex overflow-hidden">
            <div className="w-1/3 p-4 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white/70" />
              </div>
              <h1 className="text-lg font-bold text-center mb-1">Emma Wilson</h1>
              <p className="text-xs text-center text-white/80 mb-4">UX Designer</p>
              <div className="space-y-3 text-xs">
                <div className="border-t border-white/20 pt-3">
                  <h3 className="font-bold mb-2">Skills</h3>
                  {['Figma', 'UI/UX', 'Research'].map(skill => (
                    <div key={skill} className="flex items-center justify-between mb-1">
                      <span>{skill}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 4 ? 'bg-white' : 'bg-white/30'}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-2/3 bg-white p-4">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px' }}>Experience</h2>
              <div className="space-y-1 text-xs">
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        );

      case 'tokyo':
        return (
          <div className="font-serif bg-white p-6 h-full">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>Dr. Yuki Tanaka</h1>
              <p className="text-sm italic mb-2" style={{ color: accentColor }}>Associate Professor of Computer Science</p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>yuki@university.edu</span>
                <span>•</span>
                <span>ORCID: 0000-0001</span>
              </div>
              <div className="mt-3 h-0.5 mx-auto w-2/3" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-bold flex items-center gap-2 mb-2" style={{ color: primaryColor }}>
                  <BookOpen className="w-3 h-3" style={{ color: accentColor }} />
                  Research Interests
                </h2>
                <p className="text-xs text-gray-600 text-indent-4">Machine Learning, Natural Language Processing, AI Ethics</p>
              </div>
              <div>
                <h2 className="text-xs font-bold flex items-center gap-2 mb-2" style={{ color: primaryColor }}>
                  <BookOpen className="w-3 h-3" style={{ color: accentColor }} />
                  Publications
                </h2>
                <ol className="text-xs text-gray-600 list-decimal list-inside">
                  <li>Deep Learning for NLP (2024)</li>
                  <li>AI Ethics Framework (2023)</li>
                </ol>
              </div>
            </div>
          </div>
        );

      case 'dublin':
        return (
          <div className="font-sans bg-white p-6 h-full">
            <div className="p-4 rounded-xl mb-4" style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${accentColor}08)`, border: `1px solid ${primaryColor}15` }}>
              <h1 className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>Alex Murphy</h1>
              <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>Computer Science Graduate</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: accentColor }} /> alex@email.com</span>
                <span className="flex items-center gap-1"><Github className="w-3 h-3" style={{ color: accentColor }} /> github.com/alex</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="text-xs font-semibold flex items-center gap-2 mb-2" style={{ color: primaryColor }}>
                  <GraduationCap className="w-3 h-3" style={{ color: accentColor }} />
                  Education
                </h2>
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}05`, border: `1px solid ${primaryColor}15` }}>
                  <div className="font-medium text-xs">BSc Computer Science</div>
                  <div className="text-xs text-gray-500">Dublin University • GPA: 3.8</div>
                </div>
              </div>
              <div>
                <h2 className="text-xs font-semibold flex items-center gap-2 mb-2" style={{ color: primaryColor }}>
                  <Code className="w-3 h-3" style={{ color: accentColor }} />
                  Projects
                </h2>
                <div className="flex flex-wrap gap-1">
                  {['Portfolio Site', 'Chat App', 'ML Bot'].map(project => (
                    <span key={project} className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${accentColor}15`, color: primaryColor, border: `1px solid ${accentColor}30` }}>
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="font-serif bg-white p-6 h-full text-center">
            <div className="border-b-2 border-gray-800 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide mb-1">JANE WILLIAMS</h1>
              <p className="text-gray-600 italic text-sm mb-2">Marketing Director</p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>jane@email.com</span>
                <span>•</span>
                <span>Boston, MA</span>
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h2>
              <div className="space-y-1">
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="font-sans bg-white p-6 h-full">
            <div className="mb-6">
              <h1 className="text-3xl font-light text-gray-900 mb-1">Alex Chen</h1>
              <p className="text-gray-400 text-sm tracking-widest uppercase">Product Designer</p>
            </div>
            <div className="flex gap-6 text-xs text-gray-400 mb-6 pb-6 border-b border-gray-100">
              <span>alex@email.com</span>
              <span>portfolio.com</span>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">About</h2>
                <div className="h-2 w-full bg-gray-50 rounded" />
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="bg-white h-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6 text-white">
              <h1 className="text-2xl font-bold mb-1">Sarah Johnson</h1>
              <p className="text-white/80 text-sm">Creative Director</p>
            </div>
            <div className="flex">
              <div className="w-1/3 bg-gray-900 text-white p-4">
                <h3 className="text-xs font-bold text-purple-400 mb-2">CONTACT</h3>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-gray-700 rounded" />
                </div>
              </div>
              <div className="w-2/3 p-4">
                <h3 className="text-xs font-bold text-gray-800 mb-2">EXPERIENCE</h3>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="bg-white h-full overflow-hidden">
            <div className="bg-slate-800 p-6 text-center">
              <h1 className="text-xl font-bold text-white tracking-wide mb-1">MICHAEL BROWN</h1>
              <div className="w-12 h-0.5 bg-amber-500 mx-auto my-2" />
              <p className="text-amber-400 text-sm font-medium">Chief Executive Officer</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-amber-500" />
                <h2 className="text-sm font-bold text-slate-800">EXECUTIVE SUMMARY</h2>
              </div>
              <div className="ml-3 space-y-1">
                <div className="h-2 w-full bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        );

      case 'technical':
        return (
          <div className="font-mono bg-white h-full p-4">
            <div className="flex justify-between items-start border-b-2 border-blue-600 pb-3 mb-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">David Lee</h1>
                <p className="text-blue-600 text-sm">Full Stack Developer</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>github.com/david</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <h2 className="text-xs font-bold mb-2">EXPERIENCE</h2>
                <div className="bg-gray-50 rounded p-2 space-y-1">
                  <div className="h-1.5 w-full bg-gray-200 rounded" />
                </div>
              </div>
              <div className="bg-slate-900 rounded p-2 text-white">
                <h3 className="text-xs font-bold text-blue-400 mb-2">TECH STACK</h3>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-blue-500 rounded" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (compact) {
    return (
      <>
        {/* Compact Grid Layout - No horizontal scroll */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {filteredTemplates.map((template) => {
            const locked = isTemplateLocked(template.id as CVTemplate);
            const isSelected = selectedTemplate === template.id;
            return (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleTemplateClick(template.id as CVTemplate, t(template.nameKey) || template.name)}
                className={`group relative text-left p-1.5 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/5 shadow-md ring-2 ring-accent/20'
                    : locked
                      ? 'border-border opacity-70'
                      : 'border-border hover:border-accent/50 hover:shadow-sm'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center z-20 shadow-sm"
                  >
                    <Check className="w-2.5 h-2.5 text-accent-foreground" />
                  </motion.div>
                )}

                {locked && (
                  <div className="absolute top-0.5 right-0.5 z-20">
                    <Lock className="w-3 h-3 text-amber-500" />
                  </div>
                )}

                {/* Preview thumbnail */}
                <div className="bg-white rounded overflow-hidden mb-1 border border-gray-100 aspect-[3/4]">
                  <div className="transform scale-[0.06] origin-top-left" style={{ width: '1666%', height: '1666%' }}>
                    {getTemplatePreview(template.id)}
                  </div>
                </div>

                {/* Template name */}
                <p className={`text-[10px] font-medium truncate text-center leading-tight ${
                  isSelected ? 'text-accent' : 'text-foreground'
                }`}>
                  {t(template.nameKey) || template.name}
                </p>
              </motion.button>
            );
          })}
        </div>

        <TemplateCustomizationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          templateId={previewTemplate}
        />
        <WaitlistModal
          isOpen={showWaitlist}
          onClose={() => setShowWaitlist(false)}
          feature={lockedTemplateName}
          source="template-selector"
        />
      </>
    );
  }

  return (
    <>
      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="gap-2"
            >
              {category.icon}
              {category.label}
            </Button>
          ))}
        </div>

        {/* Layout Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t('template.layout') || 'Layout'}:</span>
          <div className="flex gap-1">
            {(['all', 'single-column', 'two-column'] as const).map((layout) => (
              <Badge
                key={layout}
                variant={layoutFilter === layout ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setLayoutFilter(layout)}
              >
                {layout === 'all' ? t('template.all') || 'All' :
                 layout === 'single-column' ? t('template.singleColumn') || 'Single Column' :
                 t('template.twoColumn') || 'Two Column'}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          layout
        >
          {filteredTemplates.map((template) => {
            const locked = isTemplateLocked(template.id as CVTemplate);
            return (
              <motion.button
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateClick(template.id as CVTemplate, template.name)}
                className={`group relative text-left p-3 md:p-4 rounded-xl border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-accent bg-accent/5 shadow-xl'
                    : locked
                      ? 'border-border opacity-75'
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

                {locked && (
                  <div className="absolute top-2 right-2 z-20">
                    <PremiumBadge type="badge" />
                  </div>
                )}

                {/* ATS Score Badge */}
                <div className="absolute top-2 left-2 z-20">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      template.atsScore >= 90 ? 'bg-green-100 text-green-700' :
                      template.atsScore >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}
                  >
                    ATS {template.atsScore}%
                  </Badge>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-3 md:inset-4 top-10 md:top-12 bottom-16 md:bottom-20 bg-black/0 group-hover:bg-black/50 rounded-lg transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 z-10 gap-2">
                  {locked ? (
                    <>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Crown className="w-4 h-4 text-amber-400" />
                        Premium
                      </div>
                      <div className="text-white/80 text-sm">
                        {t('premium.clickToUpgrade') || 'Click to upgrade'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Maximize2 className="w-4 h-4" />
                        {t('template.previewLarge') || 'Preview'}
                      </div>
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <Settings2 className="w-3 h-3" />
                        {t('template.customize') || 'Customize'}
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-3 h-40 md:h-48 border border-gray-100 mt-6">
                  <div className="transform scale-[0.10] origin-top-left" style={{ width: '1000%', height: '1000%' }}>
                    {getTemplatePreview(template.id)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm md:text-base">{t(template.nameKey) || template.name}</h4>
                    {template.layout === 'two-column' && (
                      <Layers className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {t(template.descriptionKey) || template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {template.recommendedFor.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 bg-muted rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <TemplateCustomizationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        templateId={previewTemplate}
      />
      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        feature={lockedTemplateName}
        source="template-selector"
      />
    </>
  );
};

export default TemplateSelector;
