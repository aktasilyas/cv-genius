import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Upload, FileText, Loader2, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { parseCVText } from '@/services/aiService';
import { defaultSectionOrder, defaultSectionVisibility } from '@/types/cv';
import { toast } from 'sonner';

const LinkedInImportPanel = () => {
  const { 
    setCVData, 
    setCreationMode,
    saveVersion
  } = useCVContext();
  const { t, language } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error(t('linkedin.pdfOnly') || 'Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(t('linkedin.fileTooLarge') || 'File is too large. Maximum size is 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Use pdf.js to extract text from PDF
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const handleImport = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);
    try {
      // Extract text from PDF
      const pdfText = await extractTextFromPDF(uploadedFile);
      
      if (!pdfText.trim()) {
        throw new Error(t('linkedin.emptyPdf') || 'Could not extract text from PDF');
      }

      // Parse the extracted text using existing AI service
      const result = await parseCVText(pdfText, language);
      
      // Save current version before overwriting
      saveVersion('Before LinkedIn Import');
      
      setCVData(prev => ({
        ...prev,
        personalInfo: result.personalInfo || prev.personalInfo,
        summary: result.summary || prev.summary,
        experience: result.experience || prev.experience,
        education: result.education || prev.education,
        skills: result.skills || prev.skills,
        languages: result.languages || prev.languages,
        certificates: result.certificates || prev.certificates,
        sectionVisibility: defaultSectionVisibility,
        sectionOrder: defaultSectionOrder
      }));

      toast.success(t('linkedin.importSuccess') || 'LinkedIn profile imported successfully!');
      setCreationMode('structured');
      setUploadedFile(null);
    } catch (error) {
      console.error('LinkedIn import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import LinkedIn profile');
    } finally {
      setIsParsing(false);
    }
  };

  const steps = [
    {
      icon: Linkedin,
      title: t('linkedin.step1Title') || 'Go to LinkedIn',
      description: t('linkedin.step1Desc') || 'Open your LinkedIn profile',
    },
    {
      icon: FileText,
      title: t('linkedin.step2Title') || 'Save as PDF',
      description: t('linkedin.step2Desc') || 'Click "More" → "Save to PDF"',
    },
    {
      icon: Upload,
      title: t('linkedin.step3Title') || 'Upload here',
      description: t('linkedin.step3Desc') || 'Upload the downloaded PDF',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center">
          <Linkedin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t('linkedin.title') || 'Import from LinkedIn'}</h2>
          <p className="text-sm text-muted-foreground">
            {t('linkedin.subtitle') || 'Import your LinkedIn profile as a starting point'}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {t('linkedin.step') || 'Step'} {index + 1}
            </div>
            <h4 className="font-medium text-sm">{step.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-600 dark:text-blue-400">
            {t('linkedin.howTo') || 'How to export your LinkedIn profile:'}
          </p>
          <ol className="mt-2 space-y-1 text-muted-foreground list-decimal list-inside">
            <li>{t('linkedin.instruction1') || 'Go to your LinkedIn profile page'}</li>
            <li>{t('linkedin.instruction2') || 'Click the "More" button below your profile photo'}</li>
            <li>{t('linkedin.instruction3') || 'Select "Save to PDF"'}</li>
            <li>{t('linkedin.instruction4') || 'Upload the downloaded PDF here'}</li>
          </ol>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          uploadedFile
            ? 'border-green-500 bg-green-500/5'
            : 'border-border hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
            >
              {t('linkedin.changeFile') || 'Change file'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{t('linkedin.dropzone') || 'Click to upload or drag and drop'}</p>
              <p className="text-sm text-muted-foreground">
                {t('linkedin.pdfFormat') || 'PDF format only (max 10MB)'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="accent"
          onClick={handleImport}
          disabled={!uploadedFile || isParsing}
          className="gap-2"
        >
          {isParsing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Linkedin className="w-4 h-4" />
          )}
          {isParsing 
            ? (t('linkedin.importing') || 'Importing...') 
            : (t('linkedin.import') || 'Import Profile')}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.open('https://www.linkedin.com/in/', '_blank')}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          {t('linkedin.openLinkedIn') || 'Open LinkedIn'}
        </Button>

        <Button
          variant="ghost"
          onClick={() => setCreationMode('structured')}
        >
          {t('linkedin.skipToManual') || 'Skip to Manual Entry'}
        </Button>
      </div>
    </motion.div>
  );
};

export default LinkedInImportPanel;
