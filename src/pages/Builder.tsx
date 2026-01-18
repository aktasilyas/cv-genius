import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Eye, FileText, Loader2, Settings, Wand2, PenTool, Layers, History, Briefcase } from 'lucide-react';
import { CVProvider, useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalInfoStep from '@/components/wizard/PersonalInfoStep';
import ExperienceStep from '@/components/wizard/ExperienceStep';
import EducationStep from '@/components/wizard/EducationStep';
import SkillsStep from '@/components/wizard/SkillsStep';
import LanguagesStep from '@/components/wizard/LanguagesStep';
import CertificatesStep from '@/components/wizard/CertificatesStep';
import SummaryStep from '@/components/wizard/SummaryStep';
import CVPreview from '@/components/builder/CVPreview';
import AIAnalysisPanel from '@/components/builder/AIAnalysisPanel';
import AITextInputPanel from '@/components/builder/AITextInputPanel';
import TemplateSelector from '@/components/builder/TemplateSelector';
import SectionControlPanel from '@/components/builder/SectionControlPanel';
import VersionHistoryPanel from '@/components/builder/VersionHistoryPanel';
import JobMatchPanel from '@/components/builder/JobMatchPanel';
import SettingsModal from '@/components/settings/SettingsModal';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';
import AuthButton from '@/components/auth/AuthButton';
import { Link } from 'react-router-dom';

const getSteps = (t: (key: string) => string) => [
  { id: 0, titleKey: 'builder.personalInfo', component: PersonalInfoStep },
  { id: 1, titleKey: 'builder.experience', component: ExperienceStep },
  { id: 2, titleKey: 'builder.education', component: EducationStep },
  { id: 3, titleKey: 'builder.skills', component: SkillsStep },
  { id: 4, titleKey: 'builder.languages', component: LanguagesStep },
  { id: 5, titleKey: 'builder.certificates', component: CertificatesStep },
  { id: 6, titleKey: 'builder.summary', component: SummaryStep },
];

const BuilderContent = () => {
  const { currentStep, setCurrentStep, cvData, selectedTemplate, creationMode, setCreationMode } = useCVContext();
  const { t } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rightPanel, setRightPanel] = useState<'preview' | 'ai' | 'job' | 'sections' | 'history'>('preview');

  const steps = getSteps(t);
  const CurrentStepComponent = steps[currentStep].component;

  const getTemplateComponent = () => {
    switch (selectedTemplate) {
      case 'modern': return ModernTemplate;
      case 'classic': return ClassicTemplate;
      case 'minimal': return MinimalTemplate;
      case 'creative': return CreativeTemplate;
      case 'executive': return ExecutiveTemplate;
      case 'technical': return TechnicalTemplate;
      default: return ModernTemplate;
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    const html2pdf = (await import('html2pdf.js')).default;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    const TemplateComponent = getTemplateComponent();
    root.render(<TemplateComponent data={cvData} />);
    await new Promise(resolve => setTimeout(resolve, 100));

    const opt = {
      margin: 0,
      filename: `${cvData.personalInfo.fullName || 'CV'}_Resume.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    const element = container.firstChild as HTMLElement;
    await html2pdf().set(opt).from(element).save();
    root.unmount();
    document.body.removeChild(container);
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-display font-semibold">CVCraft</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Creation Mode Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button
                variant={creationMode === 'structured' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCreationMode('structured')}
                className="gap-2"
              >
                <PenTool className="w-4 h-4" />
                {t('mode.structured') || 'Manual'}
              </Button>
              <Button
                variant={creationMode === 'ai-text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCreationMode('ai-text')}
                className="gap-2"
              >
                <Wand2 className="w-4 h-4" />
                {t('mode.aiText') || 'AI Parse'}
              </Button>
            </div>

            <AuthButton />
            
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="accent" size="sm" onClick={exportToPDF} disabled={isExporting}>
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {t('btn.export')}
            </Button>
          </div>
        </div>
      </header>
      
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <div className="container mx-auto px-4 py-8">
        {creationMode === 'ai-text' ? (
          <div className="max-w-3xl mx-auto">
            <AITextInputPanel />
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-3xl mx-auto overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <button key={step.id} onClick={() => setCurrentStep(step.id)} className="flex flex-col items-center min-w-[60px]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step.id ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block ${
                      currentStep === step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {t(step.titleKey) || step.titleKey.split('.')[1]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative max-w-3xl mx-auto mt-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary rounded-full" />
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-accent rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="card-elevated p-8">
                  <AnimatePresence mode="wait">
                    <CurrentStepComponent key={currentStep} />
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('btn.previous') || 'Previous'}
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button variant="accent" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>
                        {t('btn.next') || 'Next'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="accent" onClick={exportToPDF} disabled={isExporting}>
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {t('btn.export') || 'Export CV'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Template Selector */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">{t('template.choose') || 'Choose Template'}</h3>
                  <TemplateSelector compact />
                </div>
              </div>

              {/* Right Panel - Always show tabs, optionally with preview */}
              <div className="hidden lg:block space-y-4">
                <Tabs value={rightPanel} onValueChange={(v) => setRightPanel(v as any)} className="space-y-4">
                  <TabsList className="grid grid-cols-5">
                    <TabsTrigger value="preview" className="gap-1"><Eye className="w-3 h-3" /></TabsTrigger>
                    <TabsTrigger value="ai" className="gap-1"><Wand2 className="w-3 h-3" /></TabsTrigger>
                    <TabsTrigger value="job" className="gap-1"><Briefcase className="w-3 h-3" /></TabsTrigger>
                    <TabsTrigger value="sections" className="gap-1"><Layers className="w-3 h-3" /></TabsTrigger>
                    <TabsTrigger value="history" className="gap-1"><History className="w-3 h-3" /></TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview"><CVPreview /></TabsContent>
                  <TabsContent value="ai"><AIAnalysisPanel /></TabsContent>
                  <TabsContent value="job"><div className="card-elevated p-6"><JobMatchPanel /></div></TabsContent>
                  <TabsContent value="sections"><div className="card-elevated p-6"><SectionControlPanel /></div></TabsContent>
                  <TabsContent value="history"><div className="card-elevated p-6"><VersionHistoryPanel /></div></TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Builder = () => {
  return (
    <CVProvider>
      <BuilderContent />
    </CVProvider>
  );
};

export default Builder;
