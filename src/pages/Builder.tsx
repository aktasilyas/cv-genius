import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Eye, FileText, Loader2 } from 'lucide-react';
import { CVProvider, useCVContext } from '@/context/CVContext';
import { Button } from '@/components/ui/button';
import PersonalInfoStep from '@/components/wizard/PersonalInfoStep';
import ExperienceStep from '@/components/wizard/ExperienceStep';
import EducationStep from '@/components/wizard/EducationStep';
import SkillsStep from '@/components/wizard/SkillsStep';
import SummaryStep from '@/components/wizard/SummaryStep';
import CVPreview from '@/components/builder/CVPreview';
import AIAnalysisPanel from '@/components/builder/AIAnalysisPanel';
import TemplateSelector from '@/components/builder/TemplateSelector';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import { Link } from 'react-router-dom';

const steps = [
  { id: 0, title: 'Personal Info', component: PersonalInfoStep },
  { id: 1, title: 'Experience', component: ExperienceStep },
  { id: 2, title: 'Education', component: EducationStep },
  { id: 3, title: 'Skills', component: SkillsStep },
  { id: 4, title: 'Summary', component: SummaryStep },
];

const BuilderContent = () => {
  const { currentStep, setCurrentStep, cvData, selectedTemplate } = useCVContext();
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const CurrentStepComponent = steps[currentStep].component;

  const exportToPDF = async () => {
    setIsExporting(true);
    
    // Dynamic import html2pdf
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    // Render the template
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    
    const TemplateComponent = selectedTemplate === 'modern' ? ModernTemplate 
      : selectedTemplate === 'classic' ? ClassicTemplate 
      : MinimalTemplate;

    root.render(<TemplateComponent data={cvData} />);

    // Wait for render
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

    // Cleanup
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden lg:flex"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={exportToPDF}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep >= step.id
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${
                  currentStep === step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
          <div className="relative max-w-2xl mx-auto mt-2">
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
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {/* Form Section */}
          <div className={showPreview ? '' : 'lg:col-span-2'}>
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
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    variant="accent"
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="accent" onClick={exportToPDF} disabled={isExporting}>
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Export CV
                  </Button>
                )}
              </div>
            </div>

            {/* Template Selector */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
              <TemplateSelector compact />
            </div>
          </div>

          {/* Preview / AI Panel */}
          {showPreview ? (
            <CVPreview />
          ) : (
            <div className="hidden lg:block">
              <AIAnalysisPanel />
            </div>
          )}
        </div>
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
