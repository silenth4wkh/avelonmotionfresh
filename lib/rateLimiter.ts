export class RateLimiter {
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly key: string;

  constructor(maxAttempts = 3, windowMs = 900_000, key = 'rate_limit_attempts') {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.key = key;
  }

  canSubmit(): boolean {
    try {
      const recent = this.getRecentAttempts();
      this.saveAttempts(recent);
      return recent.length < this.maxAttempts;
    } catch {
      return true;
    }
  }

  recordAttempt(): void {
    try {
      const attempts = this.getAttempts();
      attempts.push(Date.now());
      const recent = attempts.filter((t) => Date.now() - t < this.windowMs);
      this.saveAttempts(recent);
    } catch {
      // silent fail
    }
  }

  getRemainingAttempts(): number {
    return Math.max(0, this.maxAttempts - this.getRecentAttempts().length);
  }

  getTimeUntilNextAttempt(): number {
    if (this.canSubmit()) return 0;
    const attempts = this.getRecentAttempts();
    if (attempts.length === 0) return 0;
    const oldest = Math.min(...attempts);
    return Math.max(0, oldest + this.windowMs - Date.now());
  }

  getTimeUntilNextAttemptFormatted(): string {
    const ms = this.getTimeUntilNextAttempt();
    if (ms === 0) return 'now';
    const minutes = Math.ceil(ms / 60_000);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }

  reset(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // silent fail
    }
  }

  private getAttempts(): number[] {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) return [];
      const parsed: unknown = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        this.reset();
        return [];
      }
      return parsed as number[];
    } catch {
      return [];
    }
  }

  private getRecentAttempts(): number[] {
    return this.getAttempts().filter((t) => Date.now() - t < this.windowMs);
  }

  private saveAttempts(attempts: number[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(attempts));
    } catch {
      // silent fail
    }
  }

  static isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

export const contactFormRateLimiter = new RateLimiter(3, 900_000, 'contact_form_attempts');
