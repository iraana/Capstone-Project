import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { supabase } from '../../supabase-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


vi.mock('../../supabase-client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      refreshSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Test component to access useAuth hook
const TestComponent = () => {
  const { user, role, roleLoading, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="user-role">{role || 'No role'}</div>
      <div data-testid="role-loading">{roleLoading ? 'Loading' : 'Loaded'}</div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  vi.clearAllMocks();

  afterEach(() => {
    queryClient.clear();
  });

  describe('Authentication State', () => {
    it('provides null user when not authenticated', async () => {
      // Mock no session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      });
    });

    it('provides user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@saultcollege.ca',
        aud: 'authenticated',
        role: 'authenticated',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'USER', is_banned: false },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@saultcollege.ca');
      });
    });
  });

  describe('User Roles', () => {
    it('fetches and provides USER role', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@saultcollege.ca',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'USER', is_banned: false },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-role')).toHaveTextContent('USER');
      });
    });

    it('fetches and provides ADMIN role', async () => {
      const mockUser = {
        id: 'admin-123',
        email: 'admin@saultcollege.ca',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'ADMIN', is_banned: false },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-role')).toHaveTextContent('ADMIN');
      });
    });

    it('handles NO_ACCESS role', async () => {
      const mockUser = {
        id: 'user-456',
        email: 'blocked@example.com',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'NO_ACCESS', is_banned: false },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);

      const mockSignOut = vi.fn();
      vi.mocked(supabase.auth.signOut).mockImplementation(mockSignOut);

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </QueryClientProvider>
      );

      // Should sign out user with NO_ACCESS
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  describe('Sign Up', () => {
    it('calls Supabase signUp with correct parameters', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSignUp = vi.fn().mockResolvedValue({
        data: { user: { id: 'new-user', email: 'new@saultcollege.ca' } },
        error: null,
      });

      vi.mocked(supabase.auth.signUp).mockImplementation(mockSignUp);

      const TestSignUp = () => {
        const { signUpWithEmail } = useAuth();
        
        return (
          <button
            onClick={() =>
              signUpWithEmail({
                email: 'new@saultcollege.ca',
                password: 'Password123!',
                options: {
                  data: {
                    first_name: 'John',
                    last_name: 'Doe',
                  },
                },
              })
            }
          >
            Sign Up
          </button>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestSignUp />
          </AuthProvider>
        </QueryClientProvider>
      );

      const signUpButton = screen.getByText('Sign Up');
      signUpButton.click();

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'new@saultcollege.ca',
          password: 'Password123!',
          options: {
            emailRedirectTo: 'https://gourmet2go.vercel.app/',
            data: {
              first_name: 'John',
              last_name: 'Doe',
            },
          },
        });
      });
    });
  });

  describe('Sign In', () => {
    it('calls Supabase signInWithPassword with correct parameters', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSignIn = vi.fn().mockResolvedValue({
        data: {},
        error: null,
      });

      vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignIn);

      const TestSignIn = () => {
        const { signInWithEmail } = useAuth();
        
        return (
          <button onClick={() => signInWithEmail('test@saultcollege.ca', 'Password123!')}>
            Sign In
          </button>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestSignIn />
          </AuthProvider>
        </QueryClientProvider>
      );

      const signInButton = screen.getByText('Sign In');
      signInButton.click();

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@saultcollege.ca',
          password: 'Password123!',
        });
      });
    });
  });

  describe('Sign Out', () => {
    it('calls Supabase signOut and clears user state', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@saultcollege.ca',
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      } as any);

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      } as any);

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { role: 'USER', is_banned: false },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      } as any);

      const mockSignOut = vi.fn();
      vi.mocked(supabase.auth.signOut).mockImplementation(mockSignOut);

      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@saultcollege.ca');
      });

      const signOutButton = screen.getByText('Sign Out');
      signOutButton.click();

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when useAuth is used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within the AuthProvider');

      consoleError.mockRestore();
    });
  });
});
