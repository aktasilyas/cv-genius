import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layout, Maximize2, Check, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { CVTemplate, TemplateCustomization, defaultTemplateCustomization } from '@/types/cv';

// Template previews
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';

interface TemplateCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: CVTemplate;
}

const colorPresets = [
  { name: 'Teal', primary: '#0d9488', accent: '#14b8a6' },
  { name: 'Blue', primary: '#2563eb', accent: '#3b82f6' },
  { name: 'Purple', primary: '#7c3aed', accent: '#8b5cf6' },
  { name: 'Rose', primary: '#e11d48', accent: '#f43f5e' },
  { name: 'Orange', primary: '#ea580c', accent: '#f97316' },
  { name: 'Emerald', primary: '#059669', accent: '#10b981' },
  { name: 'Slate', primary: '#475569', accent: '#64748b' },
  { name: 'Amber', primary: '#d97706', accent: '#f59e0b' },
];

const fontOptions = [
  { id: 'inter', name: 'Inter', style: 'font-sans' },
  { id: 'playfair', name: 'Playfair Display', style: 'font-serif' },
  { id: 'roboto', name: 'Roboto', style: 'font-sans' },
  { id: 'opensans', name: 'Open Sans', style: 'font-sans' },
  { id: 'lato', name: 'Lato', style: 'font-sans' },
  { id: 'montserrat', name: 'Montserrat', style: 'font-sans' },
];

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

  useEffect(() => {
    if (open) {
      setLocalCustomization(templateCustomization || defaultTemplateCustomization);
    }
  }, [open, templateCustomization]);

  const handleApply = () => {
    setTemplateCustomization(localCustomization);
    setSelectedTemplate(templateId);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalCustomization(defaultTemplateCustomization);
  };

  const updateCustomization = (key: keyof TemplateCustomization, value: string) => {
    setLocalCustomization(prev => ({ ...prev, [key]: value }));
  };

  const renderTemplate = () => {
    const props = { data: cvData, language, t, customization: localCustomization };
    
    switch (templateId) {
      case 'modern': return <ModernTemplate {...props} />;
      case 'classic': return <ClassicTemplate {...props} />;
      case 'minimal': return <MinimalTemplate {...props} />;
      case 'creative': return <CreativeTemplate {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      case 'technical': return <TechnicalTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/30">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            {t('template.customize')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Settings Panel */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r bg-background flex flex-col max-h-[50vh] lg:max-h-none overflow-hidden">
            <Tabs defaultValue="colors" className="flex-1 flex flex-col min-h-0">
              <TabsList className="w-full grid grid-cols-3 p-1 m-2 flex-shrink-0">
                <TabsTrigger value="colors" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  {t('template.colors')}
                </TabsTrigger>
                <TabsTrigger value="typography" className="text-xs">
                  <Type className="w-3 h-3 mr-1" />
                  {t('template.typography')}
                </TabsTrigger>
                <TabsTrigger value="layout" className="text-xs">
                  <Layout className="w-3 h-3 mr-1" />
                  {t('template.layout')}
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-4">
                <TabsContent value="colors" className="mt-0 space-y-6 pb-4">
                  {/* Color Presets */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.colorPalette')}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map((preset) => (
                        <motion.button
                          key={preset.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            updateCustomization('primaryColor', preset.primary);
                            updateCustomization('accentColor', preset.accent);
                          }}
                          className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            localCustomization.primaryColor === preset.primary
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="absolute inset-0 flex">
                            <div className="w-1/2" style={{ backgroundColor: preset.primary }} />
                            <div className="w-1/2" style={{ backgroundColor: preset.accent }} />
                          </div>
                          {localCustomization.primaryColor === preset.primary && (
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

                    <div>
                      <Label className="text-sm mb-2 block">{t('template.backgroundColor')}</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={localCustomization.backgroundColor}
                          onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
                        />
                        <input
                          type="text"
                          value={localCustomization.backgroundColor}
                          onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="mt-0 space-y-6 pb-4">
                  {/* Font Family */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">{t('template.fontFamily')}</Label>
                    <div className="space-y-2">
                      {fontOptions.map((font) => (
                        <motion.button
                          key={font.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updateCustomization('fontFamily', font.id)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            localCustomization.fontFamily === font.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <span className={`${font.style} text-lg`}>{font.name}</span>
                          <span className={`${font.style} text-xs text-muted-foreground block mt-1`}>
                            The quick brown fox jumps
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
                </TabsContent>

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
              </ScrollArea>
            </Tabs>

            {/* Action Buttons */}
            <div className="p-3 sm:p-4 border-t bg-muted/30 space-y-2 flex-shrink-0">
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
          <div className="flex-1 bg-muted/20 p-3 sm:p-6 overflow-auto min-h-[200px] lg:min-h-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-sm sm:text-lg">{t('template.preview')}</h3>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Maximize2 className="w-4 h-4" />
                {t('template.realSizePreview')}
              </div>
            </div>
            
            <div className="overflow-auto">
              <div 
                className="rounded-lg shadow-2xl mx-auto overflow-hidden"
                style={{ 
                  width: 794, 
                  minHeight: 1123,
                  transform: 'scale(var(--preview-scale, 0.35))',
                  transformOrigin: 'top left',
                  backgroundColor: localCustomization.backgroundColor,
                }}
              >
                {renderTemplate()}
              </div>
            </div>
            <style>{`
              :root {
                --preview-scale: 0.35;
              }
              @media (min-width: 640px) {
                :root {
                  --preview-scale: 0.45;
                }
              }
              @media (min-width: 1024px) {
                :root {
                  --preview-scale: 0.55;
                }
              }
            `}</style>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCustomizationModal;
