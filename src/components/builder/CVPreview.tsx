import { useEffect, useMemo, useRef, useState, memo, Suspense } from 'react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { getTemplateComponent, TemplateFallback } from '@/presentation/components/templates';

const A4_PX = { width: 794, height: 1123 };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const CVPreview = memo(() => {
  const { cvData, selectedTemplate, templateCustomization } = useCVContext();
  const { language, t } = useSettings();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const timeoutIds: number[] = [];

    const update = () => {
      const width = el.getBoundingClientRect().width || el.clientWidth;
      // Keep some padding to avoid edge clipping
      const next = clamp((width - 8) / A4_PX.width, 0.3, 1);
      setScale(Number(next.toFixed(3)));
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // Initial + a few retries (some mobile browsers don't fire ResizeObserver on display toggles)
    update();
    [50, 150, 400].forEach((ms) => timeoutIds.push(window.setTimeout(update, ms)));

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(scheduleUpdate);
      ro.observe(el);
    }

    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      cancelAnimationFrame(raf);
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const scaledSize = useMemo(
    () => ({
      width: Math.round(A4_PX.width * scale),
      height: Math.round(A4_PX.height * scale),
    }),
    [scale]
  );

  // Memoize template component to avoid re-creating on every render
  const TemplateComponent = useMemo(
    () => getTemplateComponent(selectedTemplate as any),
    [selectedTemplate]
  );

  // Memoize CV data to prevent unnecessary re-renders
  // Only update when data actually changes
  const memoizedData = useMemo(() => cvData, [JSON.stringify(cvData)]);

  // Memoize template props
  const templateProps = useMemo(
    () => ({
      data: memoizedData,
      language,
      t,
      customization: templateCustomization
    }),
    [memoizedData, language, t, templateCustomization]
  );

  return (
    <div className="bg-muted p-2 sm:p-4 rounded-xl overflow-hidden w-full">
      <div
        ref={containerRef}
        className="overflow-auto h-[60vh] sm:h-[70vh] lg:h-[80vh]"
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
            <Suspense fallback={<TemplateFallback />}>
              <TemplateComponent {...templateProps} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVPreview;
