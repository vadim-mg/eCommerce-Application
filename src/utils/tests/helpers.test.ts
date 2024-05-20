import {
  validateCity,
  validateDateOfBirth,
  validateEmail,
  validatePassword,
  validatePostalCode,
  validateStreet,
  validateUserData,
} from '../helpers';

describe('helpers module', () => {
  describe('validateLoginPassword', () => {
    test('check correct password for login', () => {
      const result = validatePassword('Password12&');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check login password leading or trailing whitespace', () => {
      const result = validatePassword('Password12& ');
      expect(result).toEqual({
        status: false,
        errorText: 'Password must not contain leading or trailing whitespace',
      });
    });

    test('check login password length', () => {
      const result = validatePassword('Qwer1$');
      expect(result).toEqual({
        status: false,
        errorText: 'Password must be at least 8 characters long',
      });
    });

    test('check login password without uppercase letters', () => {
      const result = validatePassword('qwerty1&2');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });

    test('check login password without lowercase letters', () => {
      const result = validatePassword('QWERTY1&2');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });

    test('check login password without digits', () => {
      const result = validatePassword('QWErtyu&%');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });

    test('check login password without special character (!@#$%^&*)', () => {
      const result = validatePassword('QWErtyu123');
      expect(result).toEqual({
        status: false,
        errorText:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
      });
    });
  });

  describe('validateLoginEmail', () => {
    test('check correct login email', () => {
      const result = validateEmail('user@example.com');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check login email with leading or trailing whitespace', () => {
      const result = validateEmail('user@example.com ');
      expect(result).toEqual({
        status: false,
        errorText: 'Email address must not contain leading or trailing whitespace',
      });
    });

    test('check login email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result).toEqual({
        status: false,
        errorText:
          'Your email address should include an "@ symbol separating the local part and domain name',
      });
    });

    test('check login email with incorrect domain name', () => {
      const result = validateEmail('user@example');
      expect(result).toEqual({
        status: false,
        errorText: 'Please include a domain name in your email address (e.g., example.com)',
      });
    });

    test('check incorrect login email', () => {
      const result = validateEmail('us  er@example.com');
      expect(result).toEqual({
        status: false,
        errorText:
          'Please enter a valid email address. It should follow the format: user@example.com',
      });
    });
  });

  describe('validateStreet', () => {
    test('check correct street', () => {
      const result = validateStreet('Street');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check empty street input value', () => {
      const result = validateStreet('');
      expect(result).toEqual({
        status: false,
        errorText: 'This field must contain at least one character',
      });
    });
  });

  describe('validateUserData', () => {
    test('check correct user data', () => {
      const result = validateUserData('John');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check empty user data', () => {
      const result = validateUserData('');
      expect(result).toEqual({
        status: false,
        errorText:
          'This field must contain at least one character and no special characters or numbers',
      });
    });

    test('check user data with a number', () => {
      const result = validateUserData('John2');
      expect(result).toEqual({
        status: false,
        errorText:
          'This field must contain at least one character and no special characters or numbers',
      });
    });

    test('check user data with a special characters', () => {
      const result = validateUserData('John&');
      expect(result).toEqual({
        status: false,
        errorText:
          'This field must contain at least one character and no special characters or numbers',
      });
    });
  });

  describe('validateCity', () => {
    test('check city name with 2 words', () => {
      const result = validateCity('Nizhny Novgorod');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check correct city name', () => {
      const result = validateCity('Wroclaw');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check empty city name', () => {
      const result = validateCity('');
      expect(result).toEqual({
        status: false,
        errorText:
          'This field must contain at least one character and no special characters or numbers',
      });
    });

    test('check city name with a number and special character', () => {
      const result = validateCity('City1%');
      expect(result).toEqual({
        status: false,
        errorText:
          'This field must contain at least one character and no special characters or numbers',
      });
    });
  });

  describe('validateDateOfBirth', () => {
    test('check correct date of birth', () => {
      const result = validateDateOfBirth('01/01/2000');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check empty date of birth', () => {
      const result = validateDateOfBirth('');
      expect(result).toEqual({ status: false, errorText: 'Please enter a valid date of birth' });
    });

    test('check date of birth under 13 years old', () => {
      const result = validateDateOfBirth('05/25/2011');
      expect(result).toEqual({ status: false, errorText: 'The user must be over 13 years old' });
    });
  });

  describe('validatePostalCode', () => {
    test('check correct postal code for Russia', () => {
      const result = validatePostalCode('102151', 'Russia');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check correct postal code for Poland', () => {
      const result = validatePostalCode('53-512', 'Poland');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check correct postal code for Belarus', () => {
      const result = validatePostalCode('231800', 'Belarus');
      expect(result).toEqual({ status: true, errorText: '' });
    });

    test('check incorrect postal code for Russia', () => {
      const result = validatePostalCode('675', 'Russia');
      expect(result).toEqual({
        status: false,
        errorText: 'Invalid postal code format for Russia',
      });
    });

    test('check incorrect postal code for Poland', () => {
      const result = validatePostalCode('67565', 'Poland');
      expect(result).toEqual({
        status: false,
        errorText: 'Invalid postal code format for Poland',
      });
    });

    test('check incorrect postal code for Belarus', () => {
      const result = validatePostalCode('6756-5', 'Belarus');
      expect(result).toEqual({
        status: false,
        errorText: 'Invalid postal code format for Belarus',
      });
    });
  });
});
