import { useCVContext } from '@/context/CVContext';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';

const CVPreview = () => {
  const { cvData, selectedTemplate } = useCVContext();

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={cvData} />;
      case 'classic':
        return <ClassicTemplate data={cvData} />;
      case 'minimal':
        return <MinimalTemplate data={cvData} />;
      case 'creative':
        return <CreativeTemplate data={cvData} />;
      case 'executive':
        return <ExecutiveTemplate data={cvData} />;
      case 'technical':
        return <TechnicalTemplate data={cvData} />;
      default:
        return <ModernTemplate data={cvData} />;
    }
  };

  return (
    <div className="bg-muted p-4 rounded-xl overflow-auto max-h-[85vh]">
      <div 
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
