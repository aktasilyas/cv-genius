type ErrorMessages = Record<string, Record<string, string>>;

export const errorMessages: ErrorMessages = {
  en: {
    // General Errors
    VALIDATION_ERROR: 'Please check your input',
    NOT_FOUND: 'The requested resource was not found',
    AUTH_ERROR: 'Please sign in to continue',
    AUTHORIZATION_ERROR: 'You do not have permission to perform this action',
    CONFLICT_ERROR: 'This resource already exists',
    RATE_LIMIT_ERROR: 'Too many requests. Please try again later',
    NETWORK_ERROR: 'Connection error. Please check your internet',
    UNKNOWN_ERROR: 'An unexpected error occurred',

    // CV Errors
    CV_CREATE_FAILED: 'Failed to create CV',
    CV_UPDATE_FAILED: 'Failed to update CV',
    CV_DELETE_FAILED: 'Failed to delete CV',
    CV_DUPLICATE_FAILED: 'Failed to duplicate CV',
    CV_EXPORT_FAILED: 'Failed to export CV',
    CV_INCOMPLETE: 'CV must be complete to export',

    // Auth Errors
    SIGN_IN_FAILED: 'Failed to sign in',
    SIGN_UP_FAILED: 'Failed to create account',
    SIGN_OUT_FAILED: 'Failed to sign out',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists',

    // AI Errors
    AI_ANALYSIS_FAILED: 'AI analysis failed. Please try again',
    AI_PARSE_FAILED: 'Failed to parse text',
    AI_MATCH_FAILED: 'Failed to match job',
    AI_IMPROVE_FAILED: 'Failed to improve text',
    AI_RATE_LIMIT: 'Too many AI requests. Please wait a moment',

    // Subscription Errors
    SUBSCRIPTION_FAILED: 'Failed to update subscription',
    PAYMENT_FAILED: 'Payment failed. Please try again',
    PREMIUM_REQUIRED: 'This feature requires a premium subscription',
  },
  tr: {
    // Genel Hatalar
    VALIDATION_ERROR: 'Lütfen girişlerinizi kontrol edin',
    NOT_FOUND: 'İstenen kaynak bulunamadı',
    AUTH_ERROR: 'Devam etmek için giriş yapın',
    AUTHORIZATION_ERROR: 'Bu işlemi gerçekleştirme yetkiniz yok',
    CONFLICT_ERROR: 'Bu kaynak zaten mevcut',
    RATE_LIMIT_ERROR: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin',
    NETWORK_ERROR: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin',
    UNKNOWN_ERROR: 'Beklenmeyen bir hata oluştu',

    // CV Hataları
    CV_CREATE_FAILED: 'CV oluşturulamadı',
    CV_UPDATE_FAILED: 'CV güncellenemedi',
    CV_DELETE_FAILED: 'CV silinemedi',
    CV_DUPLICATE_FAILED: 'CV kopyalanamadı',
    CV_EXPORT_FAILED: 'CV dışa aktarılamadı',
    CV_INCOMPLETE: 'CV dışa aktarmak için tamamlanmalı',

    // Kimlik Doğrulama Hataları
    SIGN_IN_FAILED: 'Giriş yapılamadı',
    SIGN_UP_FAILED: 'Hesap oluşturulamadı',
    SIGN_OUT_FAILED: 'Çıkış yapılamadı',
    INVALID_CREDENTIALS: 'Geçersiz e-posta veya şifre',
    EMAIL_ALREADY_EXISTS: 'Bu e-posta adresi ile zaten bir hesap mevcut',

    // AI Hataları
    AI_ANALYSIS_FAILED: 'AI analizi başarısız. Tekrar deneyin',
    AI_PARSE_FAILED: 'Metin ayrıştırılamadı',
    AI_MATCH_FAILED: 'İş eşleştirmesi başarısız',
    AI_IMPROVE_FAILED: 'Metin geliştirilemedi',
    AI_RATE_LIMIT: 'Çok fazla AI isteği. Lütfen bir süre bekleyin',

    // Abonelik Hataları
    SUBSCRIPTION_FAILED: 'Abonelik güncellenemedi',
    PAYMENT_FAILED: 'Ödeme başarısız. Lütfen tekrar deneyin',
    PREMIUM_REQUIRED: 'Bu özellik premium abonelik gerektirir',
  }
};

/**
 * Get localized error message
 * @param code - Error code
 * @param language - Language code (en, tr)
 * @returns Localized error message
 */
export const getErrorMessage = (code: string, language: string = 'en'): string => {
  const messages = errorMessages[language] ?? errorMessages.en;
  return messages[code] ?? messages.UNKNOWN_ERROR ?? code;
};

/**
 * Get all error messages for a language
 * @param language - Language code
 * @returns All error messages
 */
export const getAllErrorMessages = (language: string = 'en'): Record<string, string> => {
  return errorMessages[language] ?? errorMessages.en;
};
