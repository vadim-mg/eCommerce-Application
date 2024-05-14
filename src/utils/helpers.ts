function sum(a: number, b: number) {
  return a + b;
}

export const validatePassword = (inputValue: string) => {
  const trimmedPasswordValue = inputValue.trim();

  const passwordValidationRequirements = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*]/];
  const meetAllRequirements = passwordValidationRequirements.every((requirement) =>
    requirement.test(trimmedPasswordValue),
  );
  if (!meetAllRequirements) {
    return {
      status: false,
      errorText:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
    };
  }
  if (trimmedPasswordValue.length < 8) {
    return {
      status: false,
      errorText: 'Password must be at least 8 characters long',
    };
  }
  return {
    status: true,
    errorText: '',
  };
};

export const validateEmail = (inputValue: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainRegex = /@([^\s@]+\.[^\s@]+)$/;

  const trimmedEmailValue = inputValue.trim();
  if (!trimmedEmailValue.match(emailRegex)) {
    if (!trimmedEmailValue.includes('@')) {
      return {
        status: false,
        errorText:
          'Your email address should include an "@ symbol separating the local part and domain name',
      };
    }
    if (!trimmedEmailValue.match(domainRegex)) {
      return {
        status: false,
        errorText: 'Please include a domain name in your email address (e.g., example.com)',
      };
    }
    return {
      status: false,
      errorText:
        'Please enter a valid email address. It should follow the format: user@example.com',
    };
  }

  return {
    status: true,
    errorText: '',
  };
};

export default sum;
