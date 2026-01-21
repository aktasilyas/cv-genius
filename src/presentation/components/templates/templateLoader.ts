import { lazy, ComponentType } from 'react';
import { CVData } from '@/domain/entities/CVData';

/**
 * Template Component Props
 */
export interface TemplateProps {
  data: CVData;
  customization?: any;
}

/**
 * CV Template Types
 */
export type CVTemplateType = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'technical';

/**
 * Lazy Template Components
 * Each template is loaded only when needed for better performance
 */
const templateComponents: Record<CVTemplateType, () => Promise<{ default: ComponentType<TemplateProps> }>> = {
  modern: () => import('@/components/templates/ModernTemplate'),
  classic: () => import('@/components/templates/ClassicTemplate'),
  minimal: () => import('@/components/templates/MinimalTemplate'),
  creative: () => import('@/components/templates/CreativeTemplate'),
  executive: () => import('@/components/templates/ExecutiveTemplate'),
  technical: () => import('@/components/templates/TechnicalTemplate'),
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
