import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  escapeHtml,
  validateEmail,
  validateName,
  validateMessage,
  containsDangerousPatterns,
  sanitizeContactForm,
  getFieldError,
} from '@/lib/sanitizer';

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('removes < and > characters', () => {
    expect(sanitizeInput('<script>alert()</script>')).toBe('scriptalert()/script');
  });

  it('removes null bytes', () => {
    expect(sanitizeInput('hello\0world')).toBe('helloworld');
  });

  it('truncates to maxLength', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long, 500)).toHaveLength(500);
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null as unknown as string)).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });
});

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<div class="test">&amp;</div>')).toBe(
      '&lt;div class=&quot;test&quot;&gt;&amp;amp;&lt;&#x2F;div&gt;'
    );
  });

  it('returns empty string for non-string', () => {
    expect(escapeHtml(null as unknown as string)).toBe('');
  });
});

describe('validateEmail', () => {
  it('validates correct emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test+tag@domain.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('missing@')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('rejects emails that are too short or too long', () => {
    expect(validateEmail('a@b')).toBe(false);
    expect(validateEmail('a'.repeat(250) + '@b.com')).toBe(false);
  });
});

describe('validateName', () => {
  it('validates correct names', () => {
    expect(validateName('John Doe')).toBe(true);
    expect(validateName('Mary-Jane')).toBe(true);
    expect(validateName("O'Brien")).toBe(true);
    expect(validateName('Ádám Kovács')).toBe(true);
  });

  it('rejects invalid names', () => {
    expect(validateName('A')).toBe(false);
    expect(validateName('')).toBe(false);
    expect(validateName('Name123')).toBe(false);
    expect(validateName('a'.repeat(101))).toBe(false);
  });
});

describe('validateMessage', () => {
  it('validates messages within bounds', () => {
    expect(validateMessage('This is a valid message.')).toBe(true);
    expect(validateMessage('a'.repeat(1000))).toBe(true);
  });

  it('rejects messages that are too short or too long', () => {
    expect(validateMessage('short')).toBe(false);
    expect(validateMessage('a'.repeat(1001))).toBe(false);
    expect(validateMessage('')).toBe(false);
  });
});

describe('containsDangerousPatterns', () => {
  it('detects script tags', () => {
    expect(containsDangerousPatterns('<script>alert(1)</script>')).toBe(true);
  });

  it('detects javascript: protocol', () => {
    expect(containsDangerousPatterns('javascript:void(0)')).toBe(true);
  });

  it('detects inline event handlers', () => {
    expect(containsDangerousPatterns('onclick=doSomething()')).toBe(true);
  });

  it('detects eval', () => {
    expect(containsDangerousPatterns('eval(alert(1))')).toBe(true);
  });

  it('passes safe input', () => {
    expect(containsDangerousPatterns('Hello, my name is John.')).toBe(false);
    expect(containsDangerousPatterns('Please contact me at user@example.com')).toBe(false);
  });

  it('returns false for empty input', () => {
    expect(containsDangerousPatterns('')).toBe(false);
    expect(containsDangerousPatterns(null as unknown as string)).toBe(false);
  });
});

describe('sanitizeContactForm', () => {
  it('returns isValid: true for valid data', () => {
    const result = sanitizeContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message that is long enough.',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for invalid data', () => {
    const result = sanitizeContactForm({
      name: '',
      email: 'notanemail',
      message: 'short',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.message).toBeDefined();
  });
});

describe('getFieldError', () => {
  it('returns null for valid inputs', () => {
    expect(getFieldError('name', 'John Doe')).toBeNull();
    expect(getFieldError('email', 'test@example.com')).toBeNull();
    expect(getFieldError('message', 'This message is long enough to pass.')).toBeNull();
  });

  it('returns error for invalid name', () => {
    expect(getFieldError('name', 'A')).toBeTruthy();
    expect(getFieldError('name', '')).toBeTruthy();
  });

  it('returns error for invalid email', () => {
    expect(getFieldError('email', 'bad-email')).toBeTruthy();
    expect(getFieldError('email', '')).toBeTruthy();
  });

  it('returns error for invalid message', () => {
    expect(getFieldError('message', 'short')).toBeTruthy();
    expect(getFieldError('message', '')).toBeTruthy();
  });
});
