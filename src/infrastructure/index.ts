// Repositories
export { SupabaseCVRepository } from './repositories/SupabaseCVRepository';
export { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository';
export { SupabaseSubscriptionRepository } from './repositories/SupabaseSubscriptionRepository';

// Dependency Injection - Repositories
export {
  container,
  getCVRepository,
  getAuthRepository,
  getSubscriptionRepository,
  getAIService,
} from './di/container';

// Dependency Injection - Use Cases
export {
  // CV Use Cases
  getCreateCVUseCase,
  getUpdateCVUseCase,
  getDeleteCVUseCase,
  getDuplicateCVUseCase,
  getGetUserCVsUseCase,
  getGetCVByIdUseCase,
  getSetDefaultCVUseCase,
  getExportCVUseCase,

  // Auth Use Cases
  getSignInUseCase,
  getSignUpUseCase,
  getSignOutUseCase,
  getGetCurrentUserUseCase,

  // AI Use Cases
  getAnalyzeCVUseCase,
  getParseCVTextUseCase,
  getMatchJobUseCase,
  getImproveTextUseCase,
} from './di/container';
