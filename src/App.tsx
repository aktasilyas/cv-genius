import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/context/SettingsContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { AppProviders } from "@/application";
import { ErrorBoundary, GlobalErrorHandler } from "@/presentation/components/error";
import { Suspense } from "@/presentation/components/common";
import {
  LazyDashboard,
  LazyBuilder,
  LazyTemplates,
  LazyPricing,
  LazyLogin,
  LazySignup,
  LazyNotFound
} from "@/presentation/routes";
import Index from "./pages/Index"; // Keep Index eager-loaded as it's the landing page

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <SettingsProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <GlobalErrorHandler>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/builder" element={<Suspense><LazyBuilder /></Suspense>} />
                    <Route path="/templates" element={<Suspense><LazyTemplates /></Suspense>} />
                    <Route path="/dashboard" element={<Suspense><LazyDashboard /></Suspense>} />
                    <Route path="/login" element={<Suspense><LazyLogin /></Suspense>} />
                    <Route path="/signup" element={<Suspense><LazySignup /></Suspense>} />
                    <Route path="/pricing" element={<Suspense><LazyPricing /></Suspense>} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<Suspense><LazyNotFound /></Suspense>} />
                  </Routes>
                </GlobalErrorHandler>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </SettingsProvider>
      </AppProviders>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
