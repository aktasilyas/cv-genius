import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';

const CVPreview = () => {
  const { cvData, selectedTemplate, templateCustomization } = useCVContext();
  const { language, t } = useSettings();

  const renderTemplate = () => {
    const templateProps = { data: cvData, language, t, customization: templateCustomization };
    
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'classic':
        return <ClassicTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'executive':
        return <ExecutiveTemplate {...templateProps} />;
      case 'technical':
        return <TechnicalTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  return (
    <div className="bg-muted p-2 sm:p-4 rounded-xl overflow-hidden w-full">
      <div className="overflow-auto max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh]">
        <div 
          id="cv-preview-content"
          className="mx-auto shadow-xl rounded-lg overflow-hidden bg-white origin-top-left sm:origin-top"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            transform: 'scale(var(--cv-scale, 0.35))',
            transformOrigin: 'top left',
          }}
        >
          {renderTemplate()}
        </div>
      </div>
      <style>{`
        :root {
          --cv-scale: 0.32;
        }
        @media (min-width: 400px) {
          :root {
            --cv-scale: 0.38;
          }
        }
        @media (min-width: 640px) {
          :root {
            --cv-scale: 0.45;
          }
          #cv-preview-content {
            transform-origin: top center !important;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --cv-scale: 0.55;
          }
        }
        @media (min-width: 1280px) {
          :root {
            --cv-scale: 0.65;
          }
        }
      `}</style>
    </div>
  );
};

export default CVPreview;
