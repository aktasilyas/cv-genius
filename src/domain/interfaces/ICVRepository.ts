import { CVData } from '../entities/CVData';
import { CVTemplateType } from '../value-objects/CVTemplate';

export interface SavedCV {
  id: string;
  userId: string;
  title: string;
  cvData: CVData;
  selectedTemplate: CVTemplateType;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICVRepository {
  /**
   * Get all CVs for the current user
   */
  getAll(): Promise<SavedCV[]>;

  /**
   * Get a single CV by ID
   */
  getById(id: string): Promise<SavedCV | null>;

  /**
   * Create a new CV
   */
  create(title: string, cvData: CVData, template: CVTemplateType): Promise<SavedCV>;

  /**
   * Update an existing CV
   */
  update(id: string, updates: Partial<Pick<SavedCV, 'title' | 'cvData' | 'selectedTemplate'>>): Promise<SavedCV>;

  /**
   * Delete a CV
   */
  delete(id: string): Promise<void>;

  /**
   * Set a CV as the default
   */
  setDefault(id: string): Promise<void>;

  /**
   * Duplicate a CV
   */
  duplicate(id: string): Promise<SavedCV>;
}
