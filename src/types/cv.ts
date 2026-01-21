/**
 * @deprecated Import from '@/domain' instead
 * This file is kept for backwards compatibility and re-exports from the domain layer
 */

// Re-export all types and constants from domain layer
export * from '@/domain';

// Backwards compatibility - these are now in domain layer but re-exported here
import {
  defaultTemplateCustomization as _defaultTemplateCustomization,
  defaultSectionOrder as _defaultSectionOrder,
  defaultSectionVisibility as _defaultSectionVisibility,
  initialCVData as _initialCVData,
} from '@/domain';

export const defaultTemplateCustomization = _defaultTemplateCustomization;
export const defaultSectionOrder = _defaultSectionOrder;
export const defaultSectionVisibility = _defaultSectionVisibility;
export const initialCVData = _initialCVData;
