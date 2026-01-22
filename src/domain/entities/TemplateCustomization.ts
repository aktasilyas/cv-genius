import { z } from 'zod';

// Font Family - Sans-serif, Serif, Monospace
export const FontFamilySchema = z.enum([
  // Sans-serif
  'inter', 'roboto', 'opensans', 'lato', 'montserrat', 'poppins',
  // Serif
  'merriweather', 'georgia', 'playfair', 'sourceserif',
  // Monospace
  'jetbrains', 'firacode'
]);

export const FontSizeSchema = z.enum(['small', 'medium', 'large']);
export const SpacingSchema = z.enum(['compact', 'normal', 'relaxed']);
export const BorderStyleSchema = z.enum(['none', 'subtle', 'bold']);

// New layout and style schemas
export const LayoutSchema = z.enum(['single-column', 'two-column', 'sidebar-left', 'sidebar-right']);
export const HeaderStyleSchema = z.enum(['centered', 'left-aligned', 'split']);
export const SectionDividerSchema = z.enum(['line', 'space', 'background', 'border-left']);
export const NameStyleSchema = z.enum(['uppercase', 'normal', 'small-caps']);
export const DateFormatSchema = z.enum(['full', 'short', 'year-only']);
export const SkillDisplaySchema = z.enum(['tags', 'comma-list', 'bullets', 'rating-dots']);
export const PhotoShapeSchema = z.enum(['circle', 'square', 'rounded']);

export type FontFamily = z.infer<typeof FontFamilySchema>;
export type FontSize = z.infer<typeof FontSizeSchema>;
export type Spacing = z.infer<typeof SpacingSchema>;
export type BorderStyle = z.infer<typeof BorderStyleSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type HeaderStyle = z.infer<typeof HeaderStyleSchema>;
export type SectionDivider = z.infer<typeof SectionDividerSchema>;
export type NameStyle = z.infer<typeof NameStyleSchema>;
export type DateFormat = z.infer<typeof DateFormatSchema>;
export type SkillDisplay = z.infer<typeof SkillDisplaySchema>;
export type PhotoShape = z.infer<typeof PhotoShapeSchema>;

// Font family CSS mapping
export const fontFamilyMap: Record<FontFamily, string> = {
  // Sans-serif
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  opensans: "'Open Sans', sans-serif",
  lato: "'Lato', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  poppins: "'Poppins', sans-serif",
  // Serif
  merriweather: "'Merriweather', serif",
  georgia: "'Georgia', serif",
  playfair: "'Playfair Display', serif",
  sourceserif: "'Source Serif Pro', serif",
  // Monospace
  jetbrains: "'JetBrains Mono', monospace",
  firacode: "'Fira Code', monospace",
};

// Font category helper
export const fontCategories = {
  'sans-serif': ['inter', 'roboto', 'opensans', 'lato', 'montserrat', 'poppins'] as FontFamily[],
  'serif': ['merriweather', 'georgia', 'playfair', 'sourceserif'] as FontFamily[],
  'monospace': ['jetbrains', 'firacode'] as FontFamily[],
};

export const TemplateCustomizationSchema = z.object({
  // Existing color fields
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),

  // Typography
  fontFamily: FontFamilySchema,
  fontSize: FontSizeSchema,

  // Layout
  spacing: SpacingSchema,
  borderStyle: BorderStyleSchema,
  layout: LayoutSchema,
  headerStyle: HeaderStyleSchema,
  sectionDivider: SectionDividerSchema,

  // Text styling
  nameStyle: NameStyleSchema,
  dateFormat: DateFormatSchema,
  skillDisplay: SkillDisplaySchema,

  // Photo settings
  showPhoto: z.boolean(),
  photoShape: PhotoShapeSchema,
});

export type TemplateCustomization = z.infer<typeof TemplateCustomizationSchema>;

export const defaultTemplateCustomization: TemplateCustomization = {
  // Colors
  primaryColor: '#0d9488',
  accentColor: '#14b8a6',
  textColor: '#1f2937',
  backgroundColor: '#ffffff',

  // Typography
  fontFamily: 'inter',
  fontSize: 'medium',

  // Layout
  spacing: 'normal',
  borderStyle: 'subtle',
  layout: 'single-column',
  headerStyle: 'left-aligned',
  sectionDivider: 'line',

  // Text styling
  nameStyle: 'normal',
  dateFormat: 'full',
  skillDisplay: 'tags',

  // Photo
  showPhoto: false,
  photoShape: 'circle',
};

export const createTemplateCustomization = (data?: Partial<TemplateCustomization>): TemplateCustomization => {
  return TemplateCustomizationSchema.parse({
    ...defaultTemplateCustomization,
    ...data,
  });
};

export const validateTemplateCustomization = (data: unknown): data is TemplateCustomization => {
  return TemplateCustomizationSchema.safeParse(data).success;
};
