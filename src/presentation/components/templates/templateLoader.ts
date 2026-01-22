import { lazy, ComponentType } from 'react';
import { CVData } from '@/domain/entities/CVData';
import { TemplateCustomization } from '@/domain/entities/TemplateCustomization';
import { Language } from '@/lib/translations';

/**
 * Template Component Props
 */
export interface TemplateProps {
  data: CVData;
  customization?: TemplateCustomization;
  language?: Language;
  t?: (key: string) => string;
}

/**
 * CV Template Types - Extended with new sectoral templates
 */
export type CVTemplateType =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'technical'
  // New sectoral templates
  | 'berlin'      // Tech/Startup - ATS optimized
  | 'manhattan'   // Finance/Corporate
  | 'stockholm'   // Creative/Design
  | 'tokyo'       // Academic/Research
  | 'dublin';     // Entry-Level/Graduate

/**
 * Template category for filtering
 */
export type TemplateCategory = 'all' | 'professional' | 'creative' | 'academic' | 'entry-level';

/**
 * Template metadata for UI display
 */
export interface TemplateMetadata {
  id: CVTemplateType;
  name: string;
  nameKey: string; // i18n key
  description: string;
  descriptionKey: string; // i18n key
  category: TemplateCategory;
  atsScore: number; // 0-100 ATS compatibility score
  isPremium: boolean;
  layout: 'single-column' | 'two-column';
  recommendedFor: string[]; // e.g., ['tech', 'startup', 'developer']
  defaultColors: {
    primary: string;
    accent: string;
  };
}

/**
 * All templates metadata
 */
export const templateMetadata: TemplateMetadata[] = [
  // Existing templates
  {
    id: 'modern',
    name: 'Modern',
    nameKey: 'template.modern',
    description: 'Clean two-column layout with sidebar',
    descriptionKey: 'template.modern.description',
    category: 'professional',
    atsScore: 85,
    isPremium: false,
    layout: 'two-column',
    recommendedFor: ['general', 'business', 'marketing'],
    defaultColors: { primary: '#0d9488', accent: '#14b8a6' },
  },
  {
    id: 'classic',
    name: 'Classic',
    nameKey: 'template.classic',
    description: 'Traditional centered layout with serif fonts',
    descriptionKey: 'template.classic.description',
    category: 'professional',
    atsScore: 95,
    isPremium: false,
    layout: 'single-column',
    recommendedFor: ['law', 'government', 'traditional'],
    defaultColors: { primary: '#1f2937', accent: '#4b5563' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    nameKey: 'template.minimal',
    description: 'Clean minimalist design with light typography',
    descriptionKey: 'template.minimal.description',
    category: 'creative',
    atsScore: 90,
    isPremium: false,
    layout: 'single-column',
    recommendedFor: ['design', 'creative', 'startup'],
    defaultColors: { primary: '#374151', accent: '#6b7280' },
  },
  {
    id: 'creative',
    name: 'Creative',
    nameKey: 'template.creative',
    description: 'Gradient header with two-column dark sidebar',
    descriptionKey: 'template.creative.description',
    category: 'creative',
    atsScore: 70,
    isPremium: true,
    layout: 'two-column',
    recommendedFor: ['design', 'art', 'media'],
    defaultColors: { primary: '#7c3aed', accent: '#a78bfa' },
  },
  {
    id: 'executive',
    name: 'Executive',
    nameKey: 'template.executive',
    description: 'Professional corporate style with accent bars',
    descriptionKey: 'template.executive.description',
    category: 'professional',
    atsScore: 90,
    isPremium: true,
    layout: 'single-column',
    recommendedFor: ['executive', 'management', 'corporate'],
    defaultColors: { primary: '#1e3a5f', accent: '#3b82f6' },
  },
  {
    id: 'technical',
    name: 'Technical',
    nameKey: 'template.technical',
    description: 'Tech-focused monospace layout with code styling',
    descriptionKey: 'template.technical.description',
    category: 'professional',
    atsScore: 85,
    isPremium: true,
    layout: 'single-column',
    recommendedFor: ['developer', 'engineer', 'IT'],
    defaultColors: { primary: '#059669', accent: '#10b981' },
  },
  // New sectoral templates
  {
    id: 'berlin',
    name: 'Berlin',
    nameKey: 'template.berlin',
    description: 'ATS-optimized template for tech and startups',
    descriptionKey: 'template.berlin.description',
    category: 'professional',
    atsScore: 100,
    isPremium: false,
    layout: 'single-column',
    recommendedFor: ['tech', 'startup', 'developer', 'engineer'],
    defaultColors: { primary: '#1e3a5f', accent: '#0d9488' },
  },
  {
    id: 'manhattan',
    name: 'Manhattan',
    nameKey: 'template.manhattan',
    description: 'Ultra-conservative template for finance and corporate',
    descriptionKey: 'template.manhattan.description',
    category: 'professional',
    atsScore: 95,
    isPremium: true,
    layout: 'single-column',
    recommendedFor: ['finance', 'banking', 'consulting', 'corporate'],
    defaultColors: { primary: '#374151', accent: '#881337' },
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    nameKey: 'template.stockholm',
    description: 'Creative two-column layout with gradient sidebar',
    descriptionKey: 'template.stockholm.description',
    category: 'creative',
    atsScore: 65,
    isPremium: true,
    layout: 'two-column',
    recommendedFor: ['design', 'creative', 'art', 'portfolio'],
    defaultColors: { primary: '#7c3aed', accent: '#a855f7' },
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    nameKey: 'template.tokyo',
    description: 'Detailed academic CV with publications support',
    descriptionKey: 'template.tokyo.description',
    category: 'academic',
    atsScore: 90,
    isPremium: true,
    layout: 'single-column',
    recommendedFor: ['academic', 'research', 'professor', 'scientist'],
    defaultColors: { primary: '#1e3a5f', accent: '#d97706' },
  },
  {
    id: 'dublin',
    name: 'Dublin',
    nameKey: 'template.dublin',
    description: 'Fresh design for graduates and entry-level positions',
    descriptionKey: 'template.dublin.description',
    category: 'entry-level',
    atsScore: 85,
    isPremium: false,
    layout: 'single-column',
    recommendedFor: ['graduate', 'student', 'entry-level', 'intern'],
    defaultColors: { primary: '#0369a1', accent: '#22c55e' },
  },
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: TemplateCategory): TemplateMetadata[] => {
  if (category === 'all') return templateMetadata;
  return templateMetadata.filter(t => t.category === category);
};

/**
 * Get template metadata by ID
 */
export const getTemplateMetadata = (id: CVTemplateType): TemplateMetadata | undefined => {
  return templateMetadata.find(t => t.id === id);
};

/**
 * Lazy Template Components
 * Each template is loaded only when needed for better performance
 */
const templateComponents: Record<CVTemplateType, () => Promise<{ default: ComponentType<TemplateProps> }>> = {
  // Existing templates
  modern: () => import('@/components/templates/ModernTemplate'),
  classic: () => import('@/components/templates/ClassicTemplate'),
  minimal: () => import('@/components/templates/MinimalTemplate'),
  creative: () => import('@/components/templates/CreativeTemplate'),
  executive: () => import('@/components/templates/ExecutiveTemplate'),
  technical: () => import('@/components/templates/TechnicalTemplate'),
  // New sectoral templates
  berlin: () => import('@/components/templates/BerlinTemplate'),
  manhattan: () => import('@/components/templates/ManhattanTemplate'),
  stockholm: () => import('@/components/templates/StockholmTemplate'),
  tokyo: () => import('@/components/templates/TokyoTemplate'),
  dublin: () => import('@/components/templates/DublinTemplate'),
};

/**
 * Get lazy template component
 * @param template - Template type
 * @returns Lazy-loaded template component
 */
export const getTemplateComponent = (template: CVTemplateType): ComponentType<TemplateProps> => {
  return lazy(templateComponents[template]);
};

/**
 * Preload a template component
 * Useful for preloading templates before user switches to them
 * @param template - Template type to preload
 */
export const preloadTemplate = (template: CVTemplateType): void => {
  templateComponents[template]();
};

/**
 * Preload all templates
 * Use sparingly - only when you're sure all templates will be needed
 */
export const preloadAllTemplates = (): void => {
  Object.values(templateComponents).forEach(loader => loader());
};
