import { AppError } from './AppError';

export interface ErrorLog {
  id: string;
  timestamp: Date;
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private readonly maxLogs = 100;
  private readonly storageKey = 'cv-genius-error-logs';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Log an error
   */
  log(error: Error, context?: Record<string, unknown>): void {
    const log: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      code: error instanceof AppError ? error.code : 'UNKNOWN_ERROR',
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logs.unshift(log);

    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.saveToStorage();

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', log);
    }

    // Send to external service in production
    if (import.meta.env.PROD) {
      this.sendToExternalService(log).catch(console.error);
    }
  }

  /**
   * Send error log to external monitoring service
   */
  private async sendToExternalService(log: ErrorLog): Promise<void> {
    try {
      // TODO: Integrate with Sentry, LogRocket, or custom endpoint
      // Example:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log)
      // });
    } catch (error) {
      // Silent fail - don't log errors about logging
      console.warn('Failed to send error to monitoring service', error);
    }
  }

  /**
   * Get all error logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get recent errors (last N)
   */
  getRecentLogs(count: number = 10): ErrorLog[] {
    return this.logs.slice(0, count);
  }

  /**
   * Get logs by error code
   */
  getLogsByCode(code: string): ErrorLog[] {
    return this.logs.filter(log => log.code === code);
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
    this.saveToStorage();
  }

  /**
   * Save logs to localStorage
   */
  private saveToStorage(): void {
    try {
      const serialized = JSON.stringify(this.logs.slice(0, 50)); // Store max 50
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.warn('Failed to save error logs to storage', error);
    }
  }

  /**
   * Load logs from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.logs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to load error logs from storage', error);
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error statistics
   */
  getStats(): {
    total: number;
    byCode: Record<string, number>;
    last24h: number;
  } {
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    const byCode: Record<string, number> = {};
    let last24h = 0;

    this.logs.forEach(log => {
      // Count by code
      byCode[log.code] = (byCode[log.code] || 0) + 1;

      // Count last 24h
      if (log.timestamp.getTime() > dayAgo) {
        last24h++;
      }
    });

    return {
      total: this.logs.length,
      byCode,
      last24h,
    };
  }
}

export const errorLogger = new ErrorLogger();
