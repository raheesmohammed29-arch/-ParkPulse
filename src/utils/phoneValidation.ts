// Sri Lankan Phone Number Validator & Sanitizer Utility
// Rules:
// 1. Must contain exactly 10 digits.
// 2. Must start with 0 and contain only numbers (e.g., 0771234567).
// 3. Reject letters, special characters, spaces, and numbers longer than 10 digits.
// 4. Incomplete number (< 10 digits): "Please enter all 10 digits of your phone number."
// 5. Invalid number: "Enter a valid Sri Lankan mobile number."

export interface PhoneValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  status: 'empty' | 'incomplete' | 'invalid' | 'valid';
}

/**
 * Validates a Sri Lankan phone number string.
 * Returns validation status and strict error messages.
 */
export function validateSriLankanPhone(input: string): PhoneValidationResult {
  if (!input || input.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Please enter all 10 digits of your phone number.',
      status: 'empty',
    };
  }

  const digits = input.trim();

  // 1. Reject any non-digit characters (letters, symbols, spaces)
  if (!/^\d+$/.test(digits)) {
    return {
      isValid: false,
      errorMessage: 'Enter a valid Sri Lankan mobile number.',
      status: 'invalid',
    };
  }

  // 2. Must start with '0'
  if (!digits.startsWith('0')) {
    return {
      isValid: false,
      errorMessage: 'Enter a valid Sri Lankan mobile number.',
      status: 'invalid',
    };
  }

  // 3. Check for incomplete length (fewer than 10 digits, e.g. 077, 077123)
  if (digits.length < 10) {
    return {
      isValid: false,
      errorMessage: 'Please enter all 10 digits of your phone number.',
      status: 'incomplete',
    };
  }

  // 4. Longer than 10 digits
  if (digits.length > 10) {
    return {
      isValid: false,
      errorMessage: 'Enter a valid Sri Lankan mobile number.',
      status: 'invalid',
    };
  }

  // 5. Exactly 10 digits starting with 0:
  // Sri Lankan phone numbers: 2nd digit is 1-9 (07x for mobile, 01-06 for landlines).
  // 00xxxxxxxx is invalid.
  if (!/^0[1-9]\d{8}$/.test(digits)) {
    return {
      isValid: false,
      errorMessage: 'Enter a valid Sri Lankan mobile number.',
      status: 'invalid',
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    status: 'valid',
  };
}

/**
 * Strips all non-digit characters and limits length to 10.
 */
export function sanitizeSriLankanPhone(input: string): string {
  if (!input) return '';
  return input.replace(/\D/g, '').slice(0, 10);
}
