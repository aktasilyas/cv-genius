import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  iframeToken: string | null;
  merchantOid: string | null;
}

export function usePayTRCheckout() {
  const { user } = useAuth();
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    error: null,
    iframeToken: null,
    merchantOid: null,
  });

  const initiateCheckout = useCallback(async (billingPeriod: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error('Ödeme yapmak için giriş yapmalısınız');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('paytr-create-token', {
        body: {
          billingPeriod,
          userEmail: user.email,
          userName: user.user_metadata?.name || user.email?.split('@')[0],
        },
      });

      if (error) throw error;

      if (data.missingCredentials) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Ödeme sistemi henüz yapılandırılmamış. Lütfen yönetici ile iletişime geçin.',
        }));
        toast.error('Ödeme sistemi henüz yapılandırılmamış');
        return null;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setState({
        isLoading: false,
        error: null,
        iframeToken: data.token,
        merchantOid: data.merchantOid,
      });

      return data.token;
    } catch (error: any) {
      console.error('Checkout error:', error);
      const message = error.message || 'Ödeme başlatılamadı';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      toast.error(message);
      return null;
    }
  }, [user]);

  const resetCheckout = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      iframeToken: null,
      merchantOid: null,
    });
  }, []);

  return {
    ...state,
    initiateCheckout,
    resetCheckout,
  };
}
