import { useEffect, useMemo, useRef, useState } from 'react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';

const A4_PX = { width: 794, height: 1123 };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const CVPreview = () => {
  const { cvData, selectedTemplate, templateCustomization } = useCVContext();
  const { language, t } = useSettings();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      // Keep some padding to avoid edge clipping
      const next = clamp((width - 8) / A4_PX.width, 0.28, 1);
      setScale(Number(next.toFixed(3)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledSize = useMemo(
    () => ({
      width: Math.round(A4_PX.width * scale),
      height: Math.round(A4_PX.height * scale),
    }),
    [scale]
  );

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
      <div
        ref={containerRef}
        className="overflow-auto max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh]"
      >
        {/*
          Wrapper has the *scaled* size so the page layout never overflows,
          while the inner A4 canvas is scaled via transform.
        */}
        <div className="mx-auto" style={{ width: scaledSize.width, height: scaledSize.height }}>
          <div
            id="cv-preview-content"
            className="shadow-xl rounded-lg overflow-hidden bg-white"
            style={{
              width: A4_PX.width,
              minHeight: A4_PX.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              willChange: 'transform',
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
