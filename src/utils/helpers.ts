function sum(a: number, b: number) {
  return a + b;
}

// this function was created for registration form
// Password: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number
export const validateRegistrationPassword = (inputValue: string) => {
  const passwordValidationRequirements = [/[A-Z]/, /[a-z]/, /[0-9]/];
  const meetAllRequirements = passwordValidationRequirements.every((requirement) =>
    requirement.test(inputValue),
  );
  if (!meetAllRequirements || inputValue.length < 8) {
    return {
      status: false,
      errorText:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit. It must be at least 8 characters long',
    };
  }
  return {
    status: true,
    errorText: '',
  };
};

export const validatePassword = (inputValue: string) => {
  const trimmedPasswordValue = inputValue.trim();

  const passwordValidationRequirements = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*]/];
  const meetAllRequirements = passwordValidationRequirements.every((requirement) =>
    requirement.test(inputValue),
  );
  if (trimmedPasswordValue !== inputValue) {
    return {
      status: false,
      errorText: 'Password must not contain leading or trailing whitespace',
    };
  }
  if (!meetAllRequirements) {
    return {
      status: false,
      errorText:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
    };
  }
  if (inputValue.length < 8) {
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

// this function was created for registration form
// Email: A properly formatted email address (e.g., example@email.com)
export const validateRegistrationEmail = (inputValue: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!inputValue.match(emailRegex)) {
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

export const validateEmail = (inputValue: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainRegex = /@([^\s@]+\.[^\s@]+)$/;

  const trimmedEmailValue = inputValue.trim();
  if (!inputValue.match(emailRegex)) {
    if (inputValue !== trimmedEmailValue) {
      return {
        status: false,
        errorText: 'Email address must not contain leading or trailing whitespace',
      };
    }
    if (!inputValue.includes('@')) {
      return {
        status: false,
        errorText:
          'Your email address should include an "@ symbol separating the local part and domain name',
      };
    }
    if (!inputValue.match(domainRegex)) {
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

// the function can be used to validate user first name, last name and city
// First name: Must contain at least one character and no special characters or numbers
// the same requirement for last name and city
export const validateUserData = (inputValue: string) => {
  const regex = /^[a-zA-Z]+$/;
  if (!inputValue.match(regex)) {
    return {
      status: false,
      errorText:
        'This field must contain at least one character and no special characters or numbers',
    };
  }
  return {
    status: true,
    errorText: '',
  };
};

// Date of birth: A valid date input ensuring the user is above a certain age (e.g., 13 years old or older)
export const validateDateOfBirth = (inputValue: string) => {
  const minimumAge = 13;
  const date = new Date(inputValue);
  const currentDate = new Date();
  const userDateOfBirth = new Date(
    date.getFullYear() + minimumAge,
    date.getMonth(),
    date.getDate(),
  );
  if (!Number.isNaN(date.getTime())) {
    return {
      status: false,
      errorText: 'Invalid Date of Birth',
    };
  }
  if (userDateOfBirth >= currentDate) {
    return {
      status: false,
      errorText: 'The user must be over 13 years old',
    };
  }
  return {
    status: true,
    errorText: '',
  };
};

interface ICountriesRegex {
  [country: string]: RegExp;
}

const countriesRegex: ICountriesRegex = {
  Russia: /^\d{6}$/,
  Poland: /^\d{2}-\d{3}$/,
  Belarus: /^\d{6}$/,
};

// this method takes country input value as an argument too
// Postal code: Must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)
export const validatePostalCode = (inputValue: string, country: string) => {
  const regex = countriesRegex[country];
  if (!inputValue.match(regex)) {
    return {
      status: false,
      errorText: `Invalid postal code format for ${country}`,
    };
  }
  return {
    status: true,
    errorText: '',
  };
};

// I didn't add validation for countries as they are selected from the drop-down list

export default sum;
