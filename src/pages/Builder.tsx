import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Eye, FileText, Loader2, Settings, Wand2, PenTool, Layers, History, Briefcase, Save, LayoutDashboard, Linkedin } from 'lucide-react';
import { CVProvider, useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { cvService } from '@/services/cvService';
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
import LinkedInImportPanel from '@/components/builder/LinkedInImportPanel';
import TemplateSelector from '@/components/builder/TemplateSelector';
import SectionControlPanel from '@/components/builder/SectionControlPanel';
import VersionHistoryPanel from '@/components/builder/VersionHistoryPanel';
import JobMatchPanel from '@/components/builder/JobMatchPanel';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';
import AuthButton from '@/components/auth/AuthButton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rightPanel, setRightPanel] = useState<'preview' | 'ai' | 'job' | 'sections' | 'history'>('preview');
  const [editingCVId, setEditingCVId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('editing-cv-id');
    if (savedId) {
      setEditingCVId(savedId);
    }
  }, []);

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
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Find the preview element directly from DOM
      const previewElement = document.getElementById('cv-preview-content');
      
      if (previewElement) {
        // Clone the element for PDF generation
        const clone = previewElement.cloneNode(true) as HTMLElement;
        clone.style.transform = 'none';
        clone.style.width = '210mm';
        clone.style.minHeight = '297mm';
        clone.style.margin = '0';
        clone.style.padding = '0';
        
        const opt = {
          margin: 0,
          filename: `${cvData.personalInfo.fullName || 'CV'}_Resume.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            width: 794, // A4 width in pixels at 96dpi
            height: 1123, // A4 height in pixels at 96dpi
          },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        await html2pdf().set(opt).from(clone).save();
        toast.success(t('export.success') || 'PDF exported successfully!');
      } else {
        throw new Error('Preview element not found');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(t('export.error') || 'Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveCV = async () => {
    if (!isAuthenticated) {
      toast.error(t('builder.loginToSave') || 'Please sign in to save your CV');
      return;
    }

    setIsSaving(true);
    try {
      const title = cvData.personalInfo.fullName 
        ? `${cvData.personalInfo.fullName}'s CV`
        : t('dashboard.untitled') || 'Untitled CV';

      if (editingCVId) {
        await cvService.updateCV(editingCVId, {
          cv_data: cvData,
          selected_template: selectedTemplate,
          title,
        });
        toast.success(t('builder.updateSuccess') || 'CV updated successfully');
      } else {
        const newCV = await cvService.createCV(title, cvData, selectedTemplate);
        setEditingCVId(newCV.id);
        localStorage.setItem('editing-cv-id', newCV.id);
        toast.success(t('builder.saveSuccess') || 'CV saved successfully');
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error(t('builder.saveError') || 'Failed to save CV');
    } finally {
      setIsSaving(false);
    }
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
              <Button
                variant={creationMode === 'linkedin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCreationMode('linkedin')}
                className="gap-2"
              >
                <Linkedin className="w-4 h-4" />
                {t('mode.linkedin') || 'LinkedIn'}
              </Button>
            </div>

            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">{t('nav.dashboard') || 'My CVs'}</span>
              </Button>
            )}

            <AuthButton />
            
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>

            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveCV}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="hidden md:inline">{t('btn.save') || 'Save'}</span>
              </Button>
            )}

            <Button variant="accent" size="sm" onClick={exportToPDF} disabled={isExporting}>
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {t('btn.export')}
            </Button>
          </div>
        </div>
      </header>
      
      <SettingsSidebar isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <div className="container mx-auto px-4 py-8">
        {creationMode === 'ai-text' ? (
          <div className="max-w-3xl mx-auto">
            <AITextInputPanel />
          </div>
        ) : creationMode === 'linkedin' ? (
          <div className="max-w-3xl mx-auto">
            <LinkedInImportPanel />
          </div>
        ) : (
          <>
            {/* Template Selector - More Prominent */}
            <div className="mb-8 p-6 card-elevated">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    {t('template.choose') || 'Choose Template'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t('template.chooseDesc') || 'Select a template that best fits your style'}</p>
                </div>
              </div>
              <TemplateSelector compact />
            </div>

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
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Form Section - Smaller */}
              <div className="lg:col-span-2">
                <div className="card-elevated p-6">
                  <AnimatePresence mode="wait">
                    <CurrentStepComponent key={currentStep} />
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('btn.previous') || 'Previous'}
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button variant="accent" size="sm" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>
                        {t('btn.next') || 'Next'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="accent" size="sm" onClick={exportToPDF} disabled={isExporting}>
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {t('btn.export') || 'Export CV'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Larger Preview */}
              <div className="hidden lg:block lg:col-span-3 space-y-4">
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
  const { hasCompletedOnboarding, completeOnboarding, getRecommendedTemplate } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);

  const handleOnboardingComplete = (answers: any) => {
    completeOnboarding(answers);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <CVProvider>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </CVProvider>
    );
  }

  return (
    <CVProvider>
      <BuilderContent />
    </CVProvider>
  );
};

export default Builder;