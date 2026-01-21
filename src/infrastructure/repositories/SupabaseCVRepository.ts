import { supabase } from '@/integrations/supabase/client';
import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';
import { CVData, CVDataSchema } from '@/domain';
import { CVTemplateType } from '@/domain';
import { Json } from '@/integrations/supabase/types';

export class SupabaseCVRepository implements ICVRepository {

  private mapToEntity(row: any): SavedCV {
    const cvDataResult = CVDataSchema.safeParse(row.cv_data);
    if (!cvDataResult.success) {
      console.error('Invalid CV data:', cvDataResult.error);
      throw new Error(`Invalid CV data: ${cvDataResult.error.message}`);
    }

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      cvData: cvDataResult.data,
      selectedTemplate: row.selected_template as CVTemplateType,
      isDefault: row.is_default ?? false,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async getAll(): Promise<SavedCV[]> {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(row => this.mapToEntity(row));
  }

  async getById(id: string): Promise<SavedCV | null> {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return this.mapToEntity(data);
  }

  async create(title: string, cvData: CVData, template: CVTemplateType): Promise<SavedCV> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        title,
        cv_data: cvData as unknown as Json,
        selected_template: template
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(id: string, updates: Partial<Pick<SavedCV, 'title' | 'cvData' | 'selectedTemplate'>>): Promise<SavedCV> {
    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.cvData !== undefined) updateData.cv_data = updates.cvData as unknown as Json;
    if (updates.selectedTemplate !== undefined) updateData.selected_template = updates.selectedTemplate;

    const { data, error } = await supabase
      .from('cvs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('cvs').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async setDefault(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, unset all defaults for this user
    await supabase.from('cvs').update({ is_default: false }).eq('user_id', user.id);

    // Then set the new default
    const { error } = await supabase.from('cvs').update({ is_default: true }).eq('id', id);
    if (error) throw new Error(error.message);
  }

  async duplicate(id: string): Promise<SavedCV> {
    const original = await this.getById(id);
    if (!original) throw new Error('CV not found');
    return this.create(`${original.title} (Copy)`, original.cvData, original.selectedTemplate);
  }
}
