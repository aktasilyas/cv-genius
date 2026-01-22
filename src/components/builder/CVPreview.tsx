import { useEffect, useMemo, useRef, useState, memo, Suspense } from 'react';
import { Palette, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { useCVContext } from '@/context/CVContext';
import { useSettings } from '@/context/SettingsContext';
import { getTemplateComponent, TemplateFallback } from '@/presentation/components/templates';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TemplateCustomizationModal from './TemplateCustomizationModal';

const A4_PX = { width: 794, height: 1123 };
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const CVPreview = memo(() => {
  const { cvData, selectedTemplate, templateCustomization } = useCVContext();
  const { language, t } = useSettings();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.5);
  const [manualScale, setManualScale] = useState<number | null>(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);

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

  // Determine display scale based on mode
  const displayScale = manualScale !== null ? manualScale : scale;
  const displaySize = useMemo(
    () => ({
      width: Math.round(A4_PX.width * displayScale),
      height: Math.round(A4_PX.height * displayScale),
    }),
    [displayScale]
  );

  const handleZoomIn = () => {
    const currentScale = manualScale !== null ? manualScale : scale;
    const newScale = clamp(currentScale + 0.1, 0.3, 1);
    setManualScale(newScale);
  };

  const handleZoomOut = () => {
    const currentScale = manualScale !== null ? manualScale : scale;
    const newScale = clamp(currentScale - 0.1, 0.3, 1);
    setManualScale(newScale);
  };

  const handleResetZoom = () => {
    setManualScale(null);
  };

  const openFullscreenPreview = () => {
    setShowFullscreenPreview(true);
  };

  return (
    <div className="bg-muted p-2 sm:p-4 rounded-xl overflow-hidden w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomizeModal(true)}
            className="gap-2"
          >
            <Palette className="w-4 h-4" />
            {t('template.customize') || 'Customize'}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={displayScale <= 0.3}
            className="h-8 w-8"
            title={t('template.zoomOut') || 'Zoom Out'}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <button
            onClick={handleResetZoom}
            className="text-xs text-muted-foreground w-12 text-center hover:text-foreground transition-colors"
            title={t('template.resetZoom') || 'Reset Zoom'}
          >
            {Math.round(displayScale * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={displayScale >= 1}
            className="h-8 w-8"
            title={t('template.zoomIn') || 'Zoom In'}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openFullscreenPreview}
            className="gap-1 ml-2"
            title={t('template.realSizePreview') || 'Real Size Preview'}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('template.realSizePreview') || 'Real Size'}</span>
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-visible"
      >
        {/*
          Wrapper has the *scaled* size so the page layout never overflows,
          while the inner A4 canvas is scaled via transform.
        */}
        <div className="mx-auto" style={{ width: displaySize.width, height: displaySize.height }}>
          <div
            id="cv-preview-content"
            className="shadow-xl rounded-lg overflow-hidden bg-white"
            style={{
              width: A4_PX.width,
              minHeight: A4_PX.height,
              transform: `scale(${displayScale})`,
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

      {/* Template Customization Modal */}
      <TemplateCustomizationModal
        open={showCustomizeModal}
        onOpenChange={setShowCustomizeModal}
        templateId={selectedTemplate}
      />

      {/* Fullscreen Real-Size Preview Modal */}
      <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFullscreenPreview(false)}
              className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="overflow-auto max-h-[95vh] p-4 bg-muted">
              <div
                className="shadow-2xl rounded-lg overflow-hidden bg-white mx-auto"
                style={{
                  width: A4_PX.width,
                  minHeight: A4_PX.height,
                }}
              >
                <Suspense fallback={<TemplateFallback />}>
                  <TemplateComponent {...templateProps} />
                </Suspense>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVPreview;
