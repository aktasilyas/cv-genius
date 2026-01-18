import { supabase } from '@/integrations/supabase/client';
import { CVData, CVTemplate } from '@/types/cv';
import { Json } from '@/integrations/supabase/types';

export interface SavedCV {
  id: string;
  user_id: string;
  title: string;
  cv_data: CVData;
  selected_template: CVTemplate;
  is_default: boolean | null;
  created_at: string;
  updated_at: string;
}

export const cvService = {
  // Get all CVs for the current user
  async getUserCVs(): Promise<SavedCV[]> {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(cv => ({
      ...cv,
      cv_data: cv.cv_data as unknown as CVData,
      selected_template: cv.selected_template as CVTemplate,
    }));
  },

  // Get a single CV by ID
  async getCVById(id: string): Promise<SavedCV | null> {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return {
      ...data,
      cv_data: data.cv_data as unknown as CVData,
      selected_template: data.selected_template as CVTemplate,
    };
  },

  // Create a new CV
  async createCV(title: string, cvData: CVData, template: CVTemplate): Promise<SavedCV> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const insertData = {
      user_id: user.id,
      title,
      cv_data: cvData as unknown as Json,
      selected_template: template,
    };

    const { data, error } = await supabase
      .from('cvs')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      cv_data: data.cv_data as unknown as CVData,
      selected_template: data.selected_template as CVTemplate,
    };
  },

  // Update an existing CV
  async updateCV(id: string, updates: Partial<{ title: string; cv_data: CVData; selected_template: CVTemplate }>): Promise<SavedCV> {
    const updateData: Record<string, unknown> = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.cv_data) updateData.cv_data = updates.cv_data as unknown as Json;
    if (updates.selected_template) updateData.selected_template = updates.selected_template;

    const { data, error } = await supabase
      .from('cvs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      cv_data: data.cv_data as unknown as CVData,
      selected_template: data.selected_template as CVTemplate,
    };
  },

  // Delete a CV
  async deleteCV(id: string): Promise<void> {
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Set a CV as default
  async setDefaultCV(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, unset all defaults for this user
    await supabase
      .from('cvs')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Then set the new default
    const { error } = await supabase
      .from('cvs')
      .update({ is_default: true })
      .eq('id', id);

    if (error) throw error;
  },

  // Duplicate a CV
  async duplicateCV(id: string): Promise<SavedCV> {
    const original = await this.getCVById(id);
    if (!original) throw new Error('CV not found');

    return this.createCV(
      `${original.title} (Copy)`,
      original.cv_data,
      original.selected_template
    );
  },
};
