import { ICVRepository } from '@/domain/interfaces/ICVRepository';
import { IAuthRepository } from '@/domain/interfaces/IAuthRepository';
import { ISubscriptionRepository } from '@/domain/interfaces/ISubscriptionRepository';
import { IAIService } from '@/domain/interfaces/IAIService';
import { SupabaseCVRepository } from '../repositories/SupabaseCVRepository';
import { SupabaseAuthRepository } from '../repositories/SupabaseAuthRepository';
import { SupabaseSubscriptionRepository } from '../repositories/SupabaseSubscriptionRepository';

/**
 * Dependency Injection Container
 * Manages service instances and dependencies
 */
class Container {
  private static instance: Container;
  private services: Map<string, unknown> = new Map();

  private constructor() {
    // Register repositories
    this.services.set('ICVRepository', new SupabaseCVRepository());
    this.services.set('IAuthRepository', new SupabaseAuthRepository());
    this.services.set('ISubscriptionRepository', new SupabaseSubscriptionRepository());
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found in container`);
    }
    return service as T;
  }

  /**
   * Register a custom service (useful for testing)
   */
  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }
}

export const container = Container.getInstance();

// Repository Getters
export const getCVRepository = () => container.get<ICVRepository>('ICVRepository');
export const getAuthRepository = () => container.get<IAuthRepository>('IAuthRepository');
export const getSubscriptionRepository = () => container.get<ISubscriptionRepository>('ISubscriptionRepository');
export const getAIService = () => container.get<IAIService>('IAIService');

// Use Case Factories
import { CreateCVUseCase } from '@/application/use-cases/cv/CreateCVUseCase';
import { UpdateCVUseCase } from '@/application/use-cases/cv/UpdateCVUseCase';
import { DeleteCVUseCase } from '@/application/use-cases/cv/DeleteCVUseCase';
import { DuplicateCVUseCase } from '@/application/use-cases/cv/DuplicateCVUseCase';
import { GetUserCVsUseCase } from '@/application/use-cases/cv/GetUserCVsUseCase';
import { GetCVByIdUseCase } from '@/application/use-cases/cv/GetCVByIdUseCase';
import { SetDefaultCVUseCase } from '@/application/use-cases/cv/SetDefaultCVUseCase';
import { ExportCVUseCase } from '@/application/use-cases/cv/ExportCVUseCase';

import { SignInUseCase } from '@/application/use-cases/auth/SignInUseCase';
import { SignUpUseCase } from '@/application/use-cases/auth/SignUpUseCase';
import { SignOutUseCase } from '@/application/use-cases/auth/SignOutUseCase';
import { GetCurrentUserUseCase } from '@/application/use-cases/auth/GetCurrentUserUseCase';

import { AnalyzeCVUseCase } from '@/application/use-cases/ai/AnalyzeCVUseCase';
import { ParseCVTextUseCase } from '@/application/use-cases/ai/ParseCVTextUseCase';
import { MatchJobUseCase } from '@/application/use-cases/ai/MatchJobUseCase';
import { ImproveTextUseCase } from '@/application/use-cases/ai/ImproveTextUseCase';

// CV Use Cases
export const getCreateCVUseCase = () => new CreateCVUseCase(getCVRepository());
export const getUpdateCVUseCase = () => new UpdateCVUseCase(getCVRepository());
export const getDeleteCVUseCase = () => new DeleteCVUseCase(getCVRepository());
export const getDuplicateCVUseCase = () => new DuplicateCVUseCase(getCVRepository());
export const getGetUserCVsUseCase = () => new GetUserCVsUseCase(getCVRepository());
export const getGetCVByIdUseCase = () => new GetCVByIdUseCase(getCVRepository());
export const getSetDefaultCVUseCase = () => new SetDefaultCVUseCase(getCVRepository());
export const getExportCVUseCase = () => new ExportCVUseCase(getCVRepository());

// Auth Use Cases
export const getSignInUseCase = () => new SignInUseCase(getAuthRepository());
export const getSignUpUseCase = () => new SignUpUseCase(getAuthRepository());
export const getSignOutUseCase = () => new SignOutUseCase(getAuthRepository());
export const getGetCurrentUserUseCase = () => new GetCurrentUserUseCase(getAuthRepository());

// AI Use Cases
export const getAnalyzeCVUseCase = () => new AnalyzeCVUseCase(getAIService());
export const getParseCVTextUseCase = () => new ParseCVTextUseCase(getAIService());
export const getMatchJobUseCase = () => new MatchJobUseCase(getAIService());
export const getImproveTextUseCase = () => new ImproveTextUseCase(getAIService());
