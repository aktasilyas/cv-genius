/**
 * @deprecated Use ICVRepository from '@/infrastructure' instead
 * This file is kept for backwards compatibility
 */

import { getCVRepository } from '@/infrastructure';
import { CVData, CVTemplateType } from '@/domain';

// Legacy interface for backward compatibility
export interface SavedCV {
  id: string;
  user_id: string;
  title: string;
  cv_data: CVData;
  selected_template: CVTemplateType;
  is_default: boolean | null;
  created_at: string;
  updated_at: string;
}

/**
 * @deprecated Use getCVRepository() from '@/infrastructure' instead
 */
export const cvService = {
  async getUserCVs(): Promise<SavedCV[]> {
    const repo = getCVRepository();
    const cvs = await repo.getAll();
    return cvs.map(cv => ({
      id: cv.id,
      user_id: cv.userId,
      title: cv.title,
      cv_data: cv.cvData,
      selected_template: cv.selectedTemplate,
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString()
    }));
  },

  async getCVById(id: string): Promise<SavedCV | null> {
    const repo = getCVRepository();
    const cv = await repo.getById(id);
    if (!cv) return null;
    return {
      id: cv.id,
      user_id: cv.userId,
      title: cv.title,
      cv_data: cv.cvData,
      selected_template: cv.selectedTemplate,
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString()
    };
  },

  async createCV(title: string, cvData: CVData, template: CVTemplateType): Promise<SavedCV> {
    const repo = getCVRepository();
    const cv = await repo.create(title, cvData, template);
    return {
      id: cv.id,
      user_id: cv.userId,
      title: cv.title,
      cv_data: cv.cvData,
      selected_template: cv.selectedTemplate,
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString()
    };
  },

  async updateCV(id: string, updates: Partial<{ title: string; cv_data: CVData; selected_template: CVTemplateType }>): Promise<SavedCV> {
    const repo = getCVRepository();
    const repoUpdates: any = {};
    if (updates.title !== undefined) repoUpdates.title = updates.title;
    if (updates.cv_data !== undefined) repoUpdates.cvData = updates.cv_data;
    if (updates.selected_template !== undefined) repoUpdates.selectedTemplate = updates.selected_template;

    const cv = await repo.update(id, repoUpdates);
    return {
      id: cv.id,
      user_id: cv.userId,
      title: cv.title,
      cv_data: cv.cvData,
      selected_template: cv.selectedTemplate,
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString()
    };
  },

  async deleteCV(id: string): Promise<void> {
    const repo = getCVRepository();
    await repo.delete(id);
  },

  async setDefaultCV(id: string): Promise<void> {
    const repo = getCVRepository();
    await repo.setDefault(id);
  },

  async duplicateCV(id: string): Promise<SavedCV> {
    const repo = getCVRepository();
    const cv = await repo.duplicate(id);
    return {
      id: cv.id,
      user_id: cv.userId,
      title: cv.title,
      cv_data: cv.cvData,
      selected_template: cv.selectedTemplate,
      is_default: cv.isDefault,
      created_at: cv.createdAt.toISOString(),
      updated_at: cv.updatedAt.toISOString()
    };
  }
};
