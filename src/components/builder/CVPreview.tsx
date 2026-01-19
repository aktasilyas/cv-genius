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
    <div className="bg-muted p-2 sm:p-4 rounded-xl overflow-auto max-h-[70vh] sm:max-h-[85vh]">
      <div 
        id="cv-preview-content"
        className="mx-auto shadow-xl rounded-lg overflow-hidden bg-white origin-top"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
        }}
      >
        {renderTemplate()}
      </div>
      <style>{`
        @media (max-width: 640px) {
          #cv-preview-content {
            transform: scale(0.35);
            margin-bottom: -55%;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          #cv-preview-content {
            transform: scale(0.45);
            margin-bottom: -45%;
          }
        }
        @media (min-width: 1025px) {
          #cv-preview-content {
            transform: scale(0.55);
            margin-bottom: -35%;
          }
        }
      `}</style>
    </div>
  );
};

export default CVPreview;
