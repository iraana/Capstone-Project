import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSettings } from '../components/account/AccountSettings';
import { useAuth } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../../supabase-client';


vi.mock('../context/AuthContext');
vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
    },
  },
}));


vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));


vi.mock('../components/account/MyAccountTab', () => ({
  MyAccountTab: () => <div data-testid="my-account-tab">My Account Content</div>,
}));

vi.mock('../components/account/SecurityTab', () => ({
  SecurityTab: ({ onClose }: any) => (
    <div data-testid="security-tab">
      Security Content
      <button onClick={onClose}>Close from Security</button>
    </div>
  ),
}));

describe('AccountSettings', () => {
  let queryClient: QueryClient;
  const mockOnClose = vi.fn();

  const mockUser = {
    id: 'test-user-id',
    email: 'test@saultcollege.ca',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    (useAuth as any).mockReturnValue({
      user: mockUser,
    });

   
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: { first_name: 'John', last_name: 'Doe', email: 'test@saultcollege.ca', role: 'USER' },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect,
      update: vi.fn().mockReturnThis(),
      eq: mockEq,
    });

    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle, eq: mockEq });
  });

  const renderComponent = (isOpen: boolean = true) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AccountSettings isOpen={isOpen} onClose={mockOnClose} />
      </QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      renderComponent(true);
      expect(screen.getByText('User Settings')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      renderComponent(false);
      expect(screen.queryByText('User Settings')).not.toBeInTheDocument();
    });

    it('shows My Account and Security buttons', () => {
      renderComponent(true);
      expect(screen.getByRole('button', { name: /my account/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /security/i })).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('defaults to My Account tab', () => {
      renderComponent(true);
      expect(screen.getByTestId('my-account-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('security-tab')).not.toBeInTheDocument();
    });

    it('switches to Security tab when Security button is clicked', () => {
      renderComponent(true);

      const securityButton = screen.getByRole('button', { name: /security/i });
      fireEvent.click(securityButton);

      expect(screen.getByTestId('security-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('my-account-tab')).not.toBeInTheDocument();
    });

    it('switches back to My Account tab when My Account button is clicked', () => {
      renderComponent(true);

      
      const securityButton = screen.getByRole('button', { name: /security/i });
      fireEvent.click(securityButton);
      expect(screen.getByTestId('security-tab')).toBeInTheDocument();

     
      const myAccountButton = screen.getByRole('button', { name: /my account/i });
      fireEvent.click(myAccountButton);
      expect(screen.getByTestId('my-account-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('security-tab')).not.toBeInTheDocument();
    });

    it('applies active styles to the selected tab button', () => {
      renderComponent(true);

      const myAccountButton = screen.getByRole('button', { name: /my account/i });
      const securityButton = screen.getByRole('button', { name: /security/i });

      
      expect(myAccountButton.className).toContain('bg-gray-200');

      fireEvent.click(securityButton);
      expect(securityButton.className).toContain('bg-gray-200');
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button is clicked', () => {
      renderComponent(true);

      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find(button => {
        const svg = button.querySelector('svg');
        return svg !== null;
      });

      expect(closeButton).toBeDefined();
      fireEvent.click(closeButton!);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      renderComponent(true);

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not call onClose when other keys are pressed', () => {
      renderComponent(true);

      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'a' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not listen for Escape key when isOpen is false', () => {
      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <AccountSettings isOpen={true} onClose={mockOnClose} />
        </QueryClientProvider>
      );

      
      rerender(
        <QueryClientProvider client={queryClient}>
          <AccountSettings isOpen={false} onClose={mockOnClose} />
        </QueryClientProvider>
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    it('passes onClose to SecurityTab', () => {
      renderComponent(true);

     
      const securityButton = screen.getByRole('button', { name: /security/i });
      fireEvent.click(securityButton);

      
      const closeFromSecurity = screen.getByText('Close from Security');
      fireEvent.click(closeFromSecurity);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});