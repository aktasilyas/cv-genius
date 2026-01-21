import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Loader2, ArrowRight, Wand2 } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { parseCVText } from '@/services/aiService';
import { defaultSectionOrder, defaultSectionVisibility } from '@/types/cv';
import { AuthRequiredModal } from '@/presentation/components/auth/AuthGuard';
import { toast } from 'sonner';

const AITextInputPanel = () => {
  const { 
    aiTextInput, 
    setAITextInput, 
    setCVData, 
    setCreationMode,
    isParsingText,
    setIsParsingText,
    saveVersion
  } = useCVContext();
  const { t, language } = useSettings();
  const { isAuthenticated } = useAuth();
  const [showExample, setShowExample] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const exampleText = language === 'tr' ? `Ahmet Yılmaz
E-posta: ahmet.yilmaz@email.com
Telefon: +90 532 123 4567
İstanbul, Türkiye
LinkedIn: linkedin.com/in/ahmetyilmaz

Kıdemli Yazılım Mühendisi

Özet:
5+ yıl deneyimli yazılım mühendisi. React, Node.js ve bulut teknolojilerinde uzman.

Deneyim:

Tech Company - Kıdemli Yazılım Mühendisi
2021 - Günümüz
- Mikro servis mimarisine geçişi yönettim
- Ekip performansını %40 artırdım
- 3 junior geliştiriciye mentorluk yaptım

Startup Inc - Yazılım Geliştirici
2019 - 2021
- E-ticaret platformu geliştirdim
- CI/CD pipeline'ları kurdum

Eğitim:
İstanbul Teknik Üniversitesi
Bilgisayar Mühendisliği, Lisans
2015 - 2019
GPA: 3.5

Yetenekler:
React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL

Diller:
Türkçe (Ana dil), İngilizce (Profesyonel)

Sertifikalar:
AWS Solutions Architect - Amazon - 2023` : `John Doe
Email: john.doe@email.com
Phone: +1 555 123 4567
New York, USA
LinkedIn: linkedin.com/in/johndoe

Senior Software Engineer

Summary:
Experienced software engineer with 5+ years of expertise in React, Node.js, and cloud technologies.

Experience:

Tech Company - Senior Software Engineer
2021 - Present
- Led migration to microservices architecture
- Improved team performance by 40%
- Mentored 3 junior developers

Startup Inc - Software Developer
2019 - 2021
- Built e-commerce platform from scratch
- Implemented CI/CD pipelines

Education:
MIT - Computer Science, BS
2015 - 2019
GPA: 3.8

Skills:
React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL

Languages:
English (Native), Spanish (Professional)

Certificates:
AWS Solutions Architect - Amazon - 2023`;

  const handleParseClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    handleParseText();
  };

  const handleParseText = async () => {
    if (!aiTextInput.trim()) {
      toast.error(t('ai.noText') || 'Please enter some text to parse');
      return;
    }

    setIsParsingText(true);
    try {
      const result = await parseCVText(aiTextInput, language);
      
      // Save current version before overwriting
      saveVersion('Before AI Parse');
      
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

      toast.success(t('ai.parseSuccess') || 'CV parsed successfully!');
      setCreationMode('structured');
    } catch (error) {
      console.error('Parse error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse CV text';
      toast.error(errorMessage);

      // Auth hatası ise modal aç
      if (errorMessage.includes('sign in') || errorMessage.includes('Authentication')) {
        setShowAuthModal(true);
      }
    } finally {
      setIsParsingText(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t('ai.textInputTitle') || 'AI Text Parser'}</h2>
          <p className="text-sm text-muted-foreground">
            {t('ai.textInputDesc') || 'Paste your CV content and let AI structure it for you'}
          </p>
        </div>
      </div>

      <div className="relative">
        <Textarea
          value={aiTextInput}
          onChange={(e) => setAITextInput(e.target.value)}
          placeholder={t('ai.textPlaceholder') || 'Paste your CV content here... Include your personal information, experience, education, skills, and any other relevant details.'}
          className="min-h-[300px] resize-none"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {aiTextInput.length} {t('ai.characters') || 'characters'}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="accent"
          onClick={handleParseClick}
          disabled={isParsingText || !aiTextInput.trim()}
          className="gap-2"
        >
          {isParsingText ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isParsingText 
            ? (t('ai.parsing') || 'Parsing...') 
            : (t('ai.parseCV') || 'Parse with AI')}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setShowExample(!showExample);
            if (!showExample) {
              setAITextInput(exampleText);
            } else {
              setAITextInput('');
            }
          }}
        >
          <FileText className="w-4 h-4" />
          {showExample 
            ? (t('ai.clearExample') || 'Clear Example') 
            : (t('ai.showExample') || 'Show Example')}
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => setCreationMode('structured')}
        >
          {t('ai.switchToStructured') || 'Switch to Manual Entry'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          {t('ai.tipTitle') || 'Tips for best results'}
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {t('ai.tip1') || 'Include clear section headers (Experience, Education, Skills)'}</li>
          <li>• {t('ai.tip2') || 'Add dates in a recognizable format (2020-2023 or Jan 2020 - Present)'}</li>
          <li>• {t('ai.tip3') || 'List achievements with bullet points or dashes'}</li>
          <li>• {t('ai.tip4') || 'Include contact information at the beginning'}</li>
        </ul>
      </div>

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        feature="AI CV Parser"
      />
    </motion.div>
  );
};

export default AITextInputPanel;
