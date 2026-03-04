export const sanitizeInput = (input: string, maxLength = 500): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\0/g, '')
    .substring(0, maxLength);
};

export const escapeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] ?? char);
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length >= 5 && email.length <= 254;
};

export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;
  const nameRegex = /^[\p{L}\s'-]+$/u;
  return nameRegex.test(trimmed);
};

export const validateMessage = (
  message: string,
  minLength = 10,
  maxLength = 1000
): boolean => {
  if (!message || typeof message !== 'string') return false;
  const trimmed = message.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

export const containsDangerousPatterns = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  const patterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];
  return patterns.some((p) => p.test(input));
};

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface SanitizeResult {
  sanitized: Partial<ContactFormData>;
  errors: Partial<Record<keyof ContactFormData, string>>;
  isValid: boolean;
}

export const sanitizeContactForm = (formData: ContactFormData): SanitizeResult => {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  const sanitized: Partial<ContactFormData> = {};

  if (formData.name) {
    sanitized.name = sanitizeInput(formData.name, 100);
    if (!validateName(sanitized.name)) {
      errors.name = 'Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes.';
    }
  } else {
    errors.name = 'Name is required.';
  }

  if (formData.email) {
    sanitized.email = sanitizeInput(formData.email, 254).toLowerCase();
    if (!validateEmail(sanitized.email)) {
      errors.email = 'Please enter a valid email address.';
    }
  } else {
    errors.email = 'Email is required.';
  }

  if (formData.message) {
    sanitized.message = sanitizeInput(formData.message, 1000);
    if (!validateMessage(sanitized.message)) {
      errors.message = 'Message must be 10-1000 characters.';
    }
    if (containsDangerousPatterns(sanitized.message)) {
      errors.message = 'Message contains invalid characters or patterns.';
    }
  } else {
    errors.message = 'Message is required.';
  }

  return { sanitized, errors, isValid: Object.keys(errors).length === 0 };
};

export const getFieldError = (
  field: keyof ContactFormData,
  value: string
): string | null => {
  switch (field) {
    case 'name':
      if (!value) return 'Name is required';
      if (!validateName(value)) return 'Name must be 2-100 characters';
      break;
    case 'email':
      if (!value) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      break;
    case 'message':
      if (!value) return 'Message is required';
      if (!validateMessage(value)) return 'Message must be 10-1000 characters';
      if (containsDangerousPatterns(value)) return 'Message contains invalid characters';
      break;
  }
  return null;
};
