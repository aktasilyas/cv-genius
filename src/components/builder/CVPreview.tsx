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
    <div className="bg-muted p-4 rounded-xl overflow-auto max-h-[85vh]">
      <div 
        id="cv-preview-content"
        className="mx-auto shadow-xl rounded-lg overflow-hidden bg-white"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          transform: 'scale(0.55)',
          transformOrigin: 'top center',
          marginBottom: '-35%'
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CVPreview;
