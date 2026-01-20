import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PayTRIframeProps {
  token: string;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PayTRIframe = ({ token, onClose, onSuccess, onError }: PayTRIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Listen for messages from PayTR iframe
    const handleMessage = (event: MessageEvent) => {
      // PayTR sends messages about payment status
      if (event.origin.includes('paytr.com')) {
        if (event.data === 'success' || event.data?.status === 'success') {
          onSuccess?.();
        } else if (event.data === 'fail' || event.data?.status === 'fail') {
          onError?.(event.data?.message || 'Ödeme başarısız oldu');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Güvenli Ödeme</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* PayTR iFrame */}
        <div className="relative" style={{ minHeight: '500px' }}>
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10 transition-opacity duration-300" 
               id="paytr-loading">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Ödeme formu yükleniyor...</p>
            </div>
          </div>
          
          <iframe
            ref={iframeRef}
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="yes"
            style={{ width: '100%', height: '500px' }}
            onLoad={() => {
              // Hide loading overlay when iframe loads
              const loading = document.getElementById('paytr-loading');
              if (loading) {
                loading.style.opacity = '0';
                setTimeout(() => {
                  loading.style.display = 'none';
                }, 300);
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 SSL ile korunan güvenli ödeme • PayTR altyapısı
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PayTRIframe;
