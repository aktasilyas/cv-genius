import { lazy } from 'react';

/**
 * Lazy Route Definitions
 * Implements code splitting for better performance
 * Each route is loaded only when needed
 */

export const LazyDashboard = lazy(() =>
  import('@/pages/Dashboard').then(module => ({ default: module.default }))
);

export const LazyBuilder = lazy(() =>
  import('@/pages/Builder').then(module => ({ default: module.default }))
);

export const LazyTemplates = lazy(() =>
  import('@/pages/Templates').then(module => ({ default: module.default }))
);

export const LazyPricing = lazy(() =>
  import('@/pages/Pricing').then(module => ({ default: module.default }))
);

export const LazyLogin = lazy(() =>
  import('@/pages/Login').then(module => ({ default: module.default }))
);

export const LazySignup = lazy(() =>
  import('@/pages/Signup').then(module => ({ default: module.default }))
);

export const LazyNotFound = lazy(() =>
  import('@/pages/NotFound').then(module => ({ default: module.default }))
);
