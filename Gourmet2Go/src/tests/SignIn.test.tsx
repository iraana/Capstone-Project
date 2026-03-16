import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignIn } from '../components/SignIn';
import { BrowserRouter } from 'react-router';
import * as AuthContext from '../context/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext
const mockSignInWithEmail = vi.fn();

vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
  signInWithEmail: mockSignInWithEmail,
  user: null,
  role: undefined,
  roleLoading: false,
  roleError: false,
  signUpWithEmail: vi.fn(),
  signOut: vi.fn(),
});

const renderSignIn = () => {
  return render(
    <BrowserRouter>
      <SignIn />
    </BrowserRouter>
  );
};

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the sign-in form with all elements', () => {
      renderSignIn();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    it('has correct placeholder text', () => {
      renderSignIn();

      const emailInput = screen.getByPlaceholderText('40404040@saultcollege.ca');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('sign up link has correct href', () => {
      renderSignIn();

      const signUpLink = screen.getByRole('link', { name: /sign up/i });
      expect(signUpLink).toHaveAttribute('href', '/sign-up');
    });
  });

  describe('Form Validation', () => {
    it('prevents form submission when email is invalid', async () => {
  const user = userEvent.setup();
  renderSignIn();

  const emailInput = screen.getByLabelText(/email address/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });

  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  
  expect(mockSignInWithEmail).not.toHaveBeenCalled();
});

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@saultcollege.ca');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('shows errors for both empty fields', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('calls signInWithEmail with correct credentials on valid submission', async () => {
      const user = userEvent.setup();
      mockSignInWithEmail.mockResolvedValue(undefined);

      renderSignIn();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@saultcollege.ca');
      await user.type(passwordInput, 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignInWithEmail).toHaveBeenCalledWith('test@saultcollege.ca', 'Password123!');
      });
    });

    it('navigates to home page after successful sign-in', async () => {
      const user = userEvent.setup();
      mockSignInWithEmail.mockResolvedValue(undefined);

      renderSignIn();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@saultcollege.ca');
      await user.type(passwordInput, 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();
      mockSignInWithEmail.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderSignIn();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@saultcollege.ca');
      await user.type(passwordInput, 'Password123!');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });

    it('does not call signInWithEmail when form is invalid', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });

      expect(mockSignInWithEmail).not.toHaveBeenCalled();
    });
  });

  describe('User Interaction', () => {
    it('allows typing in email input', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'student@saultcollege.ca');

      expect(emailInput).toHaveValue('student@saultcollege.ca');
    });

    it('allows typing in password input', async () => {
      const user = userEvent.setup();
      renderSignIn();

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'MySecurePassword');

      expect(passwordInput).toHaveValue('MySecurePassword');
    });

    it('password input has type="password"', () => {
      renderSignIn();

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

  });
});