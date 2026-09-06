const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const MIN_PASSWORD_LENGTH = 8;

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

interface SignupFieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

const validateLoginInput = (
  email: string,
  password: string
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
};

const validateSignupInput = (
  name: string,
  email: string,
  password: string
): SignupFieldErrors => {
  const errors: SignupFieldErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
};

export { validateLoginInput, validateSignupInput };
