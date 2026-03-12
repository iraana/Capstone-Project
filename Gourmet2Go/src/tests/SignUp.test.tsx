import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUp } from '../components/SignUp';
import { BrowserRouter } from 'react-router';
import * as AuthContext from '../context/AuthContext';

// Mock AuthContext
const mockSignUpWithEmail = vi.fn();

vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
  signUpWithEmail: mockSignUpWithEmail,
  user: null,
  role: undefined,
  roleLoading: false,
  roleError: false,
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
});

const renderSignUp = () => {
  return render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );
};

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignUpWithEmail.mockResolvedValue({ data: null, error: null });  
  });

  describe('Rendering', () => {
    it('renders the sign-up form with all elements', () => {
      renderSignUp();

      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('40404040@saultcollege.ca')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('sign in link has correct href', () => {
      renderSignUp();

      const signInLink = screen.getByRole('link', { name: /sign in/i });
      expect(signInLink).toHaveAttribute('href', '/sign-in');
    });

    it('has labels for all form fields', () => {
      renderSignUp();

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  describe('Form Validation - Email', () => {
    it('prevents form submission when email is invalid', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const emailInput = screen.getByPlaceholderText('40404040@saultcollege.ca');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(mockSignUpWithEmail).not.toHaveBeenCalled();
    });
  });


  describe('Form Validation - Password', () => {
    it('shows error when password is too short', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(passwordInput, 'Short1!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('shows error when password has no number', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(passwordInput, 'Password!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
      });
    });

    it('shows error when password has no lowercase letter', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(passwordInput, 'PASSWORD123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one lowercase letter/i)).toBeInTheDocument();
      });
    });

    it('shows error when password has no uppercase letter', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(passwordInput, 'password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
      });
    });

    it('shows error when password has no special character', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(passwordInput, 'Password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one special character/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Names', () => {
    it('validates first name is required (border changes to red)', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      const firstNameInput = screen.getByPlaceholderText('John');

      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(firstNameInput).toHaveClass('border-red-500');
      });
    });

    it('validates last name is required (border changes to red)', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      const lastNameInput = screen.getByPlaceholderText('Doe');

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(lastNameInput).toHaveClass('border-red-500');
      });
    });
  });

  describe('Form Submission', () => {
    it('calls signUpWithEmail with correct data on valid submission', async () => {
      const user = userEvent.setup();
      mockSignUpWithEmail.mockResolvedValue({ data: {}, error: null });

      renderSignUp();

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockSignUpWithEmail).toHaveBeenCalledWith({
          email: 'test@saultcollege.ca',
          password: 'Password123!',
          options: {
            data: {
              first_name: 'John',
              last_name: 'Doe',
            },
          },
        });
      });
    });

    it('shows success message on successful sign-up', async () => {
      const user = userEvent.setup();
      mockSignUpWithEmail.mockResolvedValue({ data: {}, error: null });

      renderSignUp();

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText('Sign-up successful!')).toBeInTheDocument();
      });
    });

    it('shows error message on failed sign-up', async () => {
      const user = userEvent.setup();
      mockSignUpWithEmail.mockResolvedValue({ data: null, error: { message: 'Sign up failed' } });

      renderSignUp();

      await user.type(screen.getByPlaceholderText('John'), 'John');
      await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
      await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
      await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText('Error signing up')).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
  const user = userEvent.setup();
  mockSignUpWithEmail.mockImplementation(() => 
    new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 100))
  );

  renderSignUp();

  await user.type(screen.getByPlaceholderText('John'), 'John');
  await user.type(screen.getByPlaceholderText('Doe'), 'Doe');
  await user.type(screen.getByPlaceholderText('40404040@saultcollege.ca'), 'test@saultcollege.ca');
  await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
  
  const submitButton = screen.getByRole('button', { name: /sign up/i });
  await user.click(submitButton);

  expect(submitButton).toBeDisabled();
  expect(screen.getByText('Creating Account...')).toBeInTheDocument();
});

    it('does not call signUpWithEmail when form is invalid', async () => {
      const user = userEvent.setup();
      renderSignUp();

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });

      expect(mockSignUpWithEmail).not.toHaveBeenCalled();
    });
  });

  describe('User Interaction', () => {

  
    it('password input has type="password"', () => {
      renderSignUp();

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});