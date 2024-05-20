import { validateRegistrationPassword, validateLoginPassword } from '../helpers';

describe('helpers module', () => {
  describe('validateRegistrationPassword', () => {
    test('check correct password for registration', () => {
      const result = validateRegistrationPassword('Password12');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check registration password length', () => {
      const result = validateRegistrationPassword('Qwerty1');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit. It must be at least 8 characters long',
      });
    });

    test('check registration password without digits', () => {
      const result = validateRegistrationPassword('Qwertyyy');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit. It must be at least 8 characters long',
      });
    });

    test('check registration password without uppercase letters', () => {
      const result = validateRegistrationPassword('qwerty123');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit. It must be at least 8 characters long',
      });
    });

    test('check registration password without lowercase letters', () => {
      const result = validateRegistrationPassword('QWERTY123');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit. It must be at least 8 characters long',
      });
    });
  });

  describe('validateLoginPassword', () => {
    test('check correct password for login', () => {
      const result = validateLoginPassword('Password12&');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check login password leading or trailing whitespace', () => {
      const result = validateLoginPassword('Password12& ');
      expect(result).toEqual({
        status: false,
        errorText: 'Password must not contain leading or trailing whitespace',
      });
    });

    test('check login password length', () => {
      const result = validateLoginPassword('Qwer1$');
      expect(result).toEqual({
        status: false,
        errorText: 'Password must be at least 8 characters long',
      });
    });

    test('check login password without uppercase letters', () => {
      const result = validateLoginPassword('qwerty1&2');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });

    test('check login password without lowercase letters', () => {
      const result = validateLoginPassword('QWERTY1&2');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });

    test('check login password without digits', () => {
      const result = validateLoginPassword('QWErtyu&%');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });

    test('check login password without special character (!@#$%^&*)', () => {
      const result = validateLoginPassword('QWErtyu123');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });
  });
});
