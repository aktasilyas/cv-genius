import { useCVContext } from '@/context/CVContext';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

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
      default:
        return <ModernTemplate data={cvData} />;
    }
  };

  return (
    <div className="bg-muted p-4 rounded-xl h-full overflow-auto">
      <div 
        className="mx-auto shadow-xl rounded-lg overflow-hidden"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          transform: 'scale(0.6)',
          transformOrigin: 'top center'
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CVPreview;
