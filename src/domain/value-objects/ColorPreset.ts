import { z } from 'zod';

export const ColorPresetCategorySchema = z.enum(['professional', 'creative', 'minimal', 'bold']);

export type ColorPresetCategory = z.infer<typeof ColorPresetCategorySchema>;

export interface ColorPreset {
  id: string;
  name: string;
  nameKey: string; // i18n key
  colors: {
    primary: string;
    accent: string;
    text: string;
    background: string;
  };
  category: ColorPresetCategory;
}

export const colorPresets: ColorPreset[] = [
  // Professional
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    nameKey: 'preset.corporateBlue',
    colors: { primary: '#1e3a5f', accent: '#3b82f6', text: '#1f2937', background: '#ffffff' },
    category: 'professional'
  },
  {
    id: 'teal-modern',
    name: 'Teal Modern',
    nameKey: 'preset.tealModern',
    colors: { primary: '#0d9488', accent: '#14b8a6', text: '#1f2937', background: '#ffffff' },
    category: 'professional'
  },
  {
    id: 'wine',
    name: 'Wine',
    nameKey: 'preset.wine',
    colors: { primary: '#7f1d1d', accent: '#b91c1c', text: '#1f2937', background: '#ffffff' },
    category: 'professional'
  },
  {
    id: 'navy-gold',
    name: 'Navy Gold',
    nameKey: 'preset.navyGold',
    colors: { primary: '#1e3a5f', accent: '#d97706', text: '#1f2937', background: '#ffffff' },
    category: 'professional'
  },
  {
    id: 'charcoal-burgundy',
    name: 'Charcoal Burgundy',
    nameKey: 'preset.charcoalBurgundy',
    colors: { primary: '#374151', accent: '#881337', text: '#1f2937', background: '#ffffff' },
    category: 'professional'
  },

  // Creative
  {
    id: 'sunset',
    name: 'Sunset',
    nameKey: 'preset.sunset',
    colors: { primary: '#9a3412', accent: '#ea580c', text: '#1f2937', background: '#ffffff' },
    category: 'creative'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    nameKey: 'preset.lavender',
    colors: { primary: '#6b21a8', accent: '#a855f7', text: '#1f2937', background: '#ffffff' },
    category: 'creative'
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    nameKey: 'preset.oceanBreeze',
    colors: { primary: '#0369a1', accent: '#38bdf8', text: '#1f2937', background: '#ffffff' },
    category: 'creative'
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    nameKey: 'preset.roseGold',
    colors: { primary: '#be185d', accent: '#f472b6', text: '#1f2937', background: '#ffffff' },
    category: 'creative'
  },
  {
    id: 'coral',
    name: 'Coral',
    nameKey: 'preset.coral',
    colors: { primary: '#dc2626', accent: '#fb7185', text: '#1f2937', background: '#ffffff' },
    category: 'creative'
  },

  // Minimal
  {
    id: 'charcoal',
    name: 'Charcoal',
    nameKey: 'preset.charcoal',
    colors: { primary: '#374151', accent: '#6b7280', text: '#1f2937', background: '#ffffff' },
    category: 'minimal'
  },
  {
    id: 'forest',
    name: 'Forest',
    nameKey: 'preset.forest',
    colors: { primary: '#064e3b', accent: '#059669', text: '#1f2937', background: '#ffffff' },
    category: 'minimal'
  },
  {
    id: 'slate',
    name: 'Slate',
    nameKey: 'preset.slate',
    colors: { primary: '#334155', accent: '#64748b', text: '#1f2937', background: '#ffffff' },
    category: 'minimal'
  },
  {
    id: 'stone',
    name: 'Stone',
    nameKey: 'preset.stone',
    colors: { primary: '#44403c', accent: '#78716c', text: '#1f2937', background: '#ffffff' },
    category: 'minimal'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    nameKey: 'preset.neutral',
    colors: { primary: '#404040', accent: '#737373', text: '#171717', background: '#ffffff' },
    category: 'minimal'
  },

  // Bold
  {
    id: 'midnight',
    name: 'Midnight',
    nameKey: 'preset.midnight',
    colors: { primary: '#1e1b4b', accent: '#4f46e5', text: '#1f2937', background: '#ffffff' },
    category: 'bold'
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    nameKey: 'preset.electricBlue',
    colors: { primary: '#1d4ed8', accent: '#3b82f6', text: '#1f2937', background: '#ffffff' },
    category: 'bold'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    nameKey: 'preset.emerald',
    colors: { primary: '#047857', accent: '#10b981', text: '#1f2937', background: '#ffffff' },
    category: 'bold'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    nameKey: 'preset.ruby',
    colors: { primary: '#be123c', accent: '#f43f5e', text: '#1f2937', background: '#ffffff' },
    category: 'bold'
  },
  {
    id: 'amber',
    name: 'Amber',
    nameKey: 'preset.amber',
    colors: { primary: '#b45309', accent: '#f59e0b', text: '#1f2937', background: '#ffffff' },
    category: 'bold'
  },
];

// Helper to get presets by category
export const getPresetsByCategory = (category: ColorPresetCategory): ColorPreset[] => {
  return colorPresets.filter(preset => preset.category === category);
};

// Helper to get preset by id
export const getPresetById = (id: string): ColorPreset | undefined => {
  return colorPresets.find(preset => preset.id === id);
};

// All categories for UI iteration
export const colorPresetCategories: ColorPresetCategory[] = ['professional', 'creative', 'minimal', 'bold'];
