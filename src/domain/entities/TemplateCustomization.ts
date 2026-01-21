import { z } from 'zod';

export const FontFamilySchema = z.enum(['inter', 'playfair', 'roboto', 'opensans', 'lato', 'montserrat']);
export const FontSizeSchema = z.enum(['small', 'medium', 'large']);
export const SpacingSchema = z.enum(['compact', 'normal', 'relaxed']);
export const BorderStyleSchema = z.enum(['none', 'subtle', 'bold']);

export type FontFamily = z.infer<typeof FontFamilySchema>;
export type FontSize = z.infer<typeof FontSizeSchema>;
export type Spacing = z.infer<typeof SpacingSchema>;
export type BorderStyle = z.infer<typeof BorderStyleSchema>;

export const TemplateCustomizationSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  fontFamily: FontFamilySchema,
  fontSize: FontSizeSchema,
  spacing: SpacingSchema,
  borderStyle: BorderStyleSchema,
});

export type TemplateCustomization = z.infer<typeof TemplateCustomizationSchema>;

export const defaultTemplateCustomization: TemplateCustomization = {
  primaryColor: '#0d9488',
  accentColor: '#14b8a6',
  textColor: '#1f2937',
  backgroundColor: '#ffffff',
  fontFamily: 'inter',
  fontSize: 'medium',
  spacing: 'normal',
  borderStyle: 'subtle',
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
