import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Layout, Check, RotateCcw, Settings, Camera, Calendar, List, LayoutTemplate, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { CVTemplate, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';
import { colorPresets, colorPresetCategories, getPresetsByCategory, ColorPresetCategory } from '@/domain/value-objects/ColorPreset';
import { fontFamilyMap, fontCategories, FontFamily } from '@/domain/entities/TemplateCustomization';
import { templateMetadata } from '@/presentation/components/templates/templateLoader';
import { Badge } from '@/components/ui/badge';

// Lazy load templates
const ModernTemplate = lazy(() => import('@/components/templates/ModernTemplate'));
const ClassicTemplate = lazy(() => import('@/components/templates/ClassicTemplate'));
const MinimalTemplate = lazy(() => import('@/components/templates/MinimalTemplate'));
const CreativeTemplate = lazy(() => import('@/components/templates/CreativeTemplate'));
const ExecutiveTemplate = lazy(() => import('@/components/templates/ExecutiveTemplate'));
const TechnicalTemplate = lazy(() => import('@/components/templates/TechnicalTemplate'));
const BerlinTemplate = lazy(() => import('@/components/templates/BerlinTemplate'));
const ManhattanTemplate = lazy(() => import('@/components/templates/ManhattanTemplate'));
const StockholmTemplate = lazy(() => import('@/components/templates/StockholmTemplate'));
const TokyoTemplate = lazy(() => import('@/components/templates/TokyoTemplate'));
const DublinTemplate = lazy(() => import('@/components/templates/DublinTemplate'));

interface TemplateCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: CVTemplate;
}

// Font display names
const fontDisplayNames: Record<FontFamily, { name: string; category: string }> = {
  inter: { name: 'Inter', category: 'sans-serif' },
  roboto: { name: 'Roboto', category: 'sans-serif' },
  opensans: { name: 'Open Sans', category: 'sans-serif' },
  lato: { name: 'Lato', category: 'sans-serif' },
  montserrat: { name: 'Montserrat', category: 'sans-serif' },
  poppins: { name: 'Poppins', category: 'sans-serif' },
  merriweather: { name: 'Merriweather', category: 'serif' },
  georgia: { name: 'Georgia', category: 'serif' },
  playfair: { name: 'Playfair Display', category: 'serif' },
  sourceserif: { name: 'Source Serif Pro', category: 'serif' },
  jetbrains: { name: 'JetBrains Mono', category: 'monospace' },
  firacode: { name: 'Fira Code', category: 'monospace' },
};

const TemplateCustomizationModal: React.FC<TemplateCustomizationModalProps> = ({
  open,
  onOpenChange,
  templateId
}) => {
  const { cvData, setSelectedTemplate, templateCustomization, setTemplateCustomization } = useCVContext();
  const { t, language } = useSettings();

  const [localCustomization, setLocalCustomization] = useState<TemplateCustomization>(
    templateCustomization || defaultTemplateCustomization
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<CVTemplate>(templateId);
  const [colorCategory, setColorCategory] = useState<ColorPresetCategory>('professional');
  const [fontCategory, setFontCategory] = useState<'sans-serif' | 'serif' | 'monospace'>('sans-serif');
  const [previewScale, setPreviewScale] = useState(0.45);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Update preview scale based on window size
  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth >= 1280) {
        setPreviewScale(0.55);
      } else if (window.innerWidth >= 1024) {
        setPreviewScale(0.5);
      } else if (window.innerWidth >= 768) {
        setPreviewScale(0.45);
      } else {
        setPreviewScale(0.35);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (open) {
      setLocalCustomization(templateCustomization || defaultTemplateCustomization);
      setSelectedTemplateId(templateId);
    }
  }, [open, templateCustomization, templateId]);

  const handleApply = () => {
    setTemplateCustomization(localCustomization);
    setSelectedTemplate(selectedTemplateId);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalCustomization(defaultTemplateCustomization);
  };

  const updateCustomization = <K extends keyof TemplateCustomization>(
    key: K,
    value: TemplateCustomization[K]
  ) => {
    setLocalCustomization(prev => ({ ...prev, [key]: value }));
  };

  const TemplateFallback = () => (
    <div className="flex items-center justify-center min-h-[1123px] bg-white">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );

  const renderTemplate = (templateToRender: CVTemplate = selectedTemplateId) => {
    const props = { data: cvData, language, t, customization: localCustomization };

    return (
      <Suspense fallback={<TemplateFallback />}>
        {(() => {
          switch (templateToRender) {
            case 'modern': return <ModernTemplate {...props} />;
            case 'classic': return <ClassicTemplate {...props} />;
            case 'minimal': return <MinimalTemplate {...props} />;
            case 'creative': return <CreativeTemplate {...props} />;
            case 'executive': return <ExecutiveTemplate {...props} />;
            case 'technical': return <TechnicalTemplate {...props} />;
            case 'berlin': return <BerlinTemplate {...props} />;
            case 'manhattan': return <ManhattanTemplate {...props} />;
            case 'stockholm': return <StockholmTemplate {...props} />;
            case 'tokyo': return <TokyoTemplate {...props} />;
            case 'dublin': return <DublinTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
          }
        })()}
      </Suspense>
    );
  };

  // Render small template thumbnail for selection
  const renderTemplateThumbnail = (templateToRender: CVTemplate) => {
    const props = { data: cvData, language, t, customization: localCustomization };

    return (
      <Suspense fallback={<div className="w-full h-full bg-muted animate-pulse" />}>
        {(() => {
          switch (templateToRender) {
            case 'modern': return <ModernTemplate {...props} />;
            case 'classic': return <ClassicTemplate {...props} />;
            case 'minimal': return <MinimalTemplate {...props} />;
            case 'creative': return <CreativeTemplate {...props} />;
            case 'executive': return <ExecutiveTemplate {...props} />;
            case 'technical': return <TechnicalTemplate {...props} />;
            case 'berlin': return <BerlinTemplate {...props} />;
            case 'manhattan': return <ManhattanTemplate {...props} />;
            case 'stockholm': return <StockholmTemplate {...props} />;
            case 'tokyo': return <TokyoTemplate {...props} />;
            case 'dublin': return <DublinTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('template.customize')}
            </DialogTitle>

            {/* Template Selector Button */}
            <Popover open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutTemplate className="w-4 h-4" />
                  <span className="font-medium">{selectedTemplateId.charAt(0).toUpperCase() + selectedTemplateId.slice(1)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTemplateSelector ? 'rotate-180' : ''}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="end">
                <div className="p-3 border-b bg-muted/30">
                  <h4 className="font-semibold text-sm">{t('template.selectTemplate') || 'Select Template'}</h4>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-3 gap-2 p-3">
                    {templateMetadata.map((template) => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedTemplateId(template.id as CVTemplate);
                          setShowTemplateSelector(false);
                        }}
                        className={`relative text-left rounded-lg border-2 overflow-hidden transition-all ${
                          selectedTemplateId === template.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-muted-foreground/50'
                        }`}
                      >
                        {selectedTemplateId === template.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center z-10">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                        {template.isPremium && (
                          <div className="absolute top-1 left-1 z-10">
                            <Badge variant="secondary" className="text-[8px] px-1 py-0">PRO</Badge>
                          </div>
                        )}
                        {/* Template Thumbnail */}
                        <div className="bg-white border-b overflow-hidden" style={{ height: '80px' }}>
                          <div
                            className="origin-top-left"
                            style={{
                              transform: 'scale(0.06)',
                              width: 794,
                              height: 1123,
                            }}
                          >
                            {renderTemplateThumbnail(template.id as CVTemplate)}
                          </div>
                        </div>
                        {/* Template Info */}
                        <div className="p-1.5">
                          <p className={`text-[10px] font-medium truncate ${
                            selectedTemplateId === template.id ? 'text-primary' : 'text-foreground'
                          }`}>
                            {t(template.nameKey) || template.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[8px] text-muted-foreground">ATS:</span>
                            <div className="flex-1 h-0.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${template.atsScore}%` }}
                              />
                            </div>
                            <span className="text-[8px] text-muted-foreground">{template.atsScore}%</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0 h-full">
          {/* Settings Panel */}
          <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r bg-background flex flex-col lg:h-full overflow-hidden">
            {/* Action Buttons - Always visible at top on mobile, bottom on desktop */}
            <div className="p-3 sm:p-4 border-b lg:hidden bg-muted/30 space-y-2 flex-shrink-0">
              <Button onClick={handleApply} className="w-full" size="sm">
                <Check className="w-4 h-4 mr-2" />
                {t('template.applyAndSelect')}
              </Button>
              <Button variant="outline" onClick={handleReset} className="w-full" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('template.resetToDefault')}
              </Button>
            </div>

            <Tabs defaultValue="colors" className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <TabsList className="w-full grid grid-cols-4 p-1 m-2 flex-shrink-0">
                <TabsTrigger value="colors" className="text-xs px-1">
                  <Palette className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">{t('template.colors')}</span>
                </TabsTrigger>
                <TabsTrigger value="typography" className="text-xs px-1">
                  <Type className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">{t('template.typography')}</span>
                </TabsTrigger>
                <TabsTrigger value="layout" className="text-xs px-1">
                  <Layout className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">{t('template.layout')}</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs px-1">
                  <Settings className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">{t('template.advanced') || 'Advanced'}</span>
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-4 overflow-auto">
                {/* Colors Tab */}
                <TabsContent value="colors" className="mt-0 space-y-6 pb-4">
                  {/* Color Preset Categories */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.colorPalette')}</Label>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {colorPresetCategories.map((cat) => (
                        <Badge
                          key={cat}
                          variant={colorCategory === cat ? 'default' : 'outline'}
                          className="cursor-pointer capitalize"
                          onClick={() => setColorCategory(cat)}
                        >
                          {t(`preset.category.${cat}`) || cat}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {getPresetsByCategory(colorCategory).map((preset) => (
                        <motion.button
                          key={preset.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            updateCustomization('primaryColor', preset.colors.primary);
                            updateCustomization('accentColor', preset.colors.accent);
                            updateCustomization('textColor', preset.colors.text);
                            updateCustomization('backgroundColor', preset.colors.background);
                          }}
                          className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            localCustomization.primaryColor === preset.colors.primary
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-muted-foreground/30'
                          }`}
                          title={preset.name}
                        >
                          <div className="absolute inset-0 flex">
                            <div className="w-1/2" style={{ backgroundColor: preset.colors.primary }} />
                            <div className="w-1/2" style={{ backgroundColor: preset.colors.accent }} />
                          </div>
                          {localCustomization.primaryColor === preset.colors.primary && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">{t('template.primaryColor')}</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={localCustomization.primaryColor}
                          onChange={(e) => updateCustomization('primaryColor', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
                        />
                        <input
                          type="text"
                          value={localCustomization.primaryColor}
                          onChange={(e) => updateCustomization('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">{t('template.accentColor')}</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={localCustomization.accentColor}
                          onChange={(e) => updateCustomization('accentColor', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
                        />
                        <input
                          type="text"
                          value={localCustomization.accentColor}
                          onChange={(e) => updateCustomization('accentColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">{t('template.textColor')}</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={localCustomization.textColor}
                          onChange={(e) => updateCustomization('textColor', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
                        />
                        <input
                          type="text"
                          value={localCustomization.textColor}
                          onChange={(e) => updateCustomization('textColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="mt-0 space-y-6 pb-4">
                  {/* Font Category */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.fontFamily')}</Label>
                    <div className="flex gap-1 mb-3">
                      {(['sans-serif', 'serif', 'monospace'] as const).map((cat) => (
                        <Badge
                          key={cat}
                          variant={fontCategory === cat ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => setFontCategory(cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {fontCategories[fontCategory].map((fontId) => (
                        <motion.button
                          key={fontId}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updateCustomization('fontFamily', fontId)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            localCustomization.fontFamily === fontId
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <span
                            className="text-lg"
                            style={{ fontFamily: fontFamilyMap[fontId] }}
                          >
                            {fontDisplayNames[fontId].name}
                          </span>
                          <span
                            className="text-xs text-muted-foreground block mt-1"
                            style={{ fontFamily: fontFamilyMap[fontId] }}
                          >
                            The quick brown fox jumps over the lazy dog
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.fontSize')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('fontSize', size)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.fontSize === size
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <span className={`block ${
                            size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base'
                          }`}>
                            {t(`template.${size}`)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Name Style */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.nameStyle') || 'Name Style'}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'uppercase', 'small-caps'] as const).map((style) => (
                        <motion.button
                          key={style}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('nameStyle', style)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.nameStyle === style
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <span
                            className="block text-sm"
                            style={{
                              textTransform: style === 'uppercase' ? 'uppercase' :
                                           style === 'small-caps' ? 'uppercase' : 'none',
                              letterSpacing: style === 'small-caps' ? '0.1em' : 'normal',
                              fontSize: style === 'small-caps' ? '0.85em' : undefined,
                            }}
                          >
                            John Doe
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="mt-0 space-y-6 pb-4">
                  {/* Spacing */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.spacing')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
                        <motion.button
                          key={spacing}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('spacing', spacing)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.spacing === spacing
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1 mb-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 bg-muted-foreground/30 rounded ${
                                  spacing === 'compact' ? 'w-6' : spacing === 'normal' ? 'w-8' : 'w-10'
                                }`}
                                style={{
                                  marginTop: spacing === 'compact' ? '2px' : spacing === 'normal' ? '4px' : '6px'
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs">
                            {t(`template.${spacing}`)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Header Style */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.headerStyle') || 'Header Style'}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left-aligned', 'centered', 'split'] as const).map((style) => (
                        <motion.button
                          key={style}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('headerStyle', style)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.headerStyle === style
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className={`h-8 flex items-center ${
                            style === 'centered' ? 'justify-center' :
                            style === 'split' ? 'justify-between' : 'justify-start'
                          } mb-1`}>
                            <div className="w-8 h-2 bg-muted-foreground/30 rounded" />
                            {style === 'split' && <div className="w-4 h-2 bg-muted-foreground/20 rounded" />}
                          </div>
                          <span className="text-xs capitalize">{style.replace('-', ' ')}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Section Divider */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.sectionDivider') || 'Section Divider'}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['line', 'space', 'border-left', 'background'] as const).map((divider) => (
                        <motion.button
                          key={divider}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('sectionDivider', divider)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.sectionDivider === divider
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="h-8 flex flex-col justify-center mb-1">
                            {divider === 'line' && (
                              <div className="w-full h-0.5 bg-primary/50" />
                            )}
                            {divider === 'space' && (
                              <div className="w-full h-4" />
                            )}
                            {divider === 'border-left' && (
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary/50" />
                                <div className="w-12 h-2 bg-muted-foreground/30 rounded" />
                              </div>
                            )}
                            {divider === 'background' && (
                              <div className="w-full h-6 bg-muted/50 rounded flex items-center px-2">
                                <div className="w-8 h-2 bg-muted-foreground/30 rounded" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs capitalize">{divider.replace('-', ' ')}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Border Style */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.borderStyle')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['none', 'subtle', 'bold'] as const).map((border) => (
                        <motion.button
                          key={border}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('borderStyle', border)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.borderStyle === border
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div
                            className={`w-full h-8 rounded mb-1 ${
                              border === 'none'
                                ? 'bg-muted'
                                : border === 'subtle'
                                ? 'border border-muted-foreground/30'
                                : 'border-2 border-muted-foreground'
                            }`}
                          />
                          <span className="text-xs">
                            {t(`template.${border}`)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="mt-0 space-y-6 pb-4">
                  {/* Date Format */}
                  <div>
                    <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('template.dateFormat') || 'Date Format'}
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['full', 'short', 'year-only'] as const).map((format) => (
                        <motion.button
                          key={format}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('dateFormat', format)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.dateFormat === format
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <span className="block text-xs text-muted-foreground mb-1">
                            {format === 'full' ? 'January 2024' :
                             format === 'short' ? 'Jan 2024' : '2024'}
                          </span>
                          <span className="text-xs capitalize">{format.replace('-', ' ')}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Skill Display */}
                  <div>
                    <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                      <List className="w-4 h-4" />
                      {t('template.skillDisplay') || 'Skill Display'}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['tags', 'comma-list', 'bullets', 'rating-dots'] as const).map((display) => (
                        <motion.button
                          key={display}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization('skillDisplay', display)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            localCustomization.skillDisplay === display
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="h-8 flex items-center justify-center mb-1">
                            {display === 'tags' && (
                              <div className="flex gap-1">
                                <span className="px-1.5 py-0.5 bg-primary/20 rounded text-xs">JS</span>
                                <span className="px-1.5 py-0.5 bg-primary/20 rounded text-xs">TS</span>
                              </div>
                            )}
                            {display === 'comma-list' && (
                              <span className="text-xs text-muted-foreground">JS, TS, React</span>
                            )}
                            {display === 'bullets' && (
                              <div className="flex flex-col text-xs text-muted-foreground">
                                <span>• JavaScript</span>
                                <span>• TypeScript</span>
                              </div>
                            )}
                            {display === 'rating-dots' && (
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <span key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-primary' : 'bg-muted'}`} />
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs capitalize">{display.replace('-', ' ')}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Photo Settings */}
                  <div>
                    <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      {t('template.photoSettings') || 'Photo Settings'}
                    </Label>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">{t('template.showPhoto') || 'Show Photo'}</Label>
                        <Switch
                          checked={localCustomization.showPhoto}
                          onCheckedChange={(checked) => updateCustomization('showPhoto', checked)}
                        />
                      </div>

                      {localCustomization.showPhoto && (
                        <div>
                          <Label className="text-sm mb-2 block">{t('template.photoShape') || 'Photo Shape'}</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['circle', 'rounded', 'square'] as const).map((shape) => (
                              <motion.button
                                key={shape}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateCustomization('photoShape', shape)}
                                className={`p-3 rounded-lg border-2 text-center transition-all ${
                                  localCustomization.photoShape === shape
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-muted-foreground/30'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 bg-muted-foreground/30 mx-auto mb-1 ${
                                    shape === 'circle' ? 'rounded-full' :
                                    shape === 'rounded' ? 'rounded-lg' : 'rounded-none'
                                  }`}
                                />
                                <span className="text-xs capitalize">{shape}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Action Buttons - Desktop only (mobile has buttons at top) */}
            <div className="hidden lg:block p-3 sm:p-4 border-t bg-muted/30 space-y-2 flex-shrink-0">
              <Button onClick={handleApply} className="w-full" size="sm">
                <Check className="w-4 h-4 mr-2" />
                {t('template.applyAndSelect')}
              </Button>
              <Button variant="outline" onClick={handleReset} className="w-full" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('template.resetToDefault')}
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-muted/20 p-3 sm:p-6 overflow-hidden min-h-[200px] lg:min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
              <h3 className="font-semibold text-sm sm:text-lg">{t('template.preview')}</h3>
              <span className="text-xs text-muted-foreground">
                {Math.round(previewScale * 100)}%
              </span>
            </div>

            <div className="flex-1 flex items-start justify-center overflow-hidden">
              {/* Container that holds the scaled preview */}
              <div
                className="flex-shrink-0"
                style={{
                  width: Math.round(794 * previewScale),
                  height: Math.round(1123 * previewScale),
                  overflow: 'hidden',
                }}
              >
                <div
                  className="rounded-lg shadow-2xl overflow-hidden bg-white"
                  style={{
                    width: 794,
                    height: 1123,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCustomizationModal;
