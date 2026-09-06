const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/u;

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

interface SignupFieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface ProfileFieldErrors {
  name?: string;
  username?: string;
}

interface PasswordChangeFieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
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

const validateProfileInput = (
  name: string,
  username: string
): ProfileFieldErrors => {
  const errors: ProfileFieldErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  }

  if (!username.trim()) {
    errors.username = "Username is required.";
  } else if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    errors.username = `Username must be ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters.`;
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = "Use letters, numbers, underscores, or periods.";
  }

  return errors;
};

const validatePasswordChangeInput = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): PasswordChangeFieldErrors => {
  const errors: PasswordChangeFieldErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required.";
  } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export {
  validateLoginInput,
  validatePasswordChangeInput,
  validateProfileInput,
  validateSignupInput,
};
