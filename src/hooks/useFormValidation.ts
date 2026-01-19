import { useState, useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';

export interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  date?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
}

export const useFormValidation = () => {
  const { t } = useSettings();
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback((value: string, rules: ValidationRules): string | null => {
    if (rules.required && (!value || value.trim() === '')) {
      return t('validation.required') || 'This field is required';
    }

    if (value && rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return t('validation.email') || 'Please enter a valid email address';
      }
    }

    if (value && rules.phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return t('validation.phone') || 'Please enter a valid phone number';
      }
    }

    if (value && rules.date) {
      // Accept formats: YYYY-MM, YYYY-MM-DD, Month Year, Present
      const dateFormats = [
        /^\d{4}-\d{2}(-\d{2})?$/, // YYYY-MM or YYYY-MM-DD
        /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i, // Month Year
        /^(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4}$/i, // Turkish Month Year
        /^present$/i,
        /^current$/i,
        /^devam$/i, // Turkish for "ongoing"
        /^halen$/i, // Turkish for "still"
      ];
      
      const isValidDate = dateFormats.some(regex => regex.test(value.trim()));
      if (!isValidDate && value.trim() !== '') {
        return t('validation.date') || 'Please use format: YYYY-MM (e.g., 2024-01)';
      }
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      return (t('validation.minLength') || 'Minimum {min} characters required').replace('{min}', String(rules.minLength));
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return (t('validation.maxLength') || 'Maximum {max} characters allowed').replace('{max}', String(rules.maxLength));
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return t('validation.pattern') || 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [t]);

  const markTouched = useCallback((fieldId: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldId));
  }, []);

  const isTouched = useCallback((fieldId: string) => {
    return touchedFields.has(fieldId);
  }, [touchedFields]);

  const resetTouched = useCallback(() => {
    setTouchedFields(new Set());
  }, []);

  const markAllTouched = useCallback((fieldIds: string[]) => {
    setTouchedFields(new Set(fieldIds));
  }, []);

  return {
    validateField,
    markTouched,
    isTouched,
    resetTouched,
    markAllTouched,
    touchedFields,
  };
};

export default useFormValidation;
