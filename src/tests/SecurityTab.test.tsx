import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecurityTab } from '../components/account/SecurityTab';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { supabase } from '../../supabase-client';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../context/AuthContext');
vi.mock('react-router');
vi.mock('../../supabase-client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

// Mock sonner to handle toast calls
vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SecurityTab', () => {
  const mockOnClose = vi.fn();
  const mockSignOut = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuth as any).mockReturnValue({
      signOut: mockSignOut,
    });
    
    (useNavigate as any).mockReturnValue(mockNavigate);
    
    global.fetch = vi.fn();
  });

  describe('Rendering', () => {
    it('renders the Security heading', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      expect(screen.getByText('Security', { selector: 'h1' })).toBeInTheDocument();
    });

    it('renders the Change Password section', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to change password/i })).toBeInTheDocument();
    });

    it('renders the Danger Zone section', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      expect(screen.getByText('Danger Zone')).toBeInTheDocument();
      expect(screen.getByText(/once you delete your account, there is no going back/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^delete account$/i })).toBeInTheDocument();
    });
  });

  describe('Change Password', () => {
    it('navigates to reset-password page when clicking Go To Change Password', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      const changePasswordButton = screen.getByRole('button', { name: /go to change password/i });
      fireEvent.click(changePasswordButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/reset-password');
    });

    it('calls onClose when clicking Go To Change Password', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      const changePasswordButton = screen.getByRole('button', { name: /go to change password/i });
      fireEvent.click(changePasswordButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Delete Account Modal', () => {
    it('shows confirmation modal when clicking Delete Account', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      const deleteButton = screen.getByRole('button', { name: /^delete account$/i });
      fireEvent.click(deleteButton);
      
      expect(screen.getByText('Delete Account', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Delete my account')).toBeInTheDocument();
    });

    it('does not delete account when modal is cancelled', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }));
      
      // Click cancel
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);
      
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
      expect(screen.queryByText('Delete Account', { selector: 'h3' })).not.toBeInTheDocument(); // Modal closes
    });

    it('requires exact text to enable the Confirm Deletion button', async () => {
      const user = userEvent.setup();
      render(<SecurityTab onClose={mockOnClose} />);
      
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }));
      
      const confirmButton = screen.getByRole('button', { name: /confirm deletion/i });
      const input = screen.getByPlaceholderText('Delete my account');
      
      // Initially disabled
      expect(confirmButton).toBeDisabled();
      
      // Typing wrong text
      await user.type(input, 'delete my accoun');
      expect(confirmButton).toBeDisabled();
      
      // Type exact string
      await user.clear(input);
      await user.type(input, 'Delete my account');
      expect(confirmButton).not.toBeDisabled();
    });

    it('successfully deletes account and signs out user', async () => {
      const user = userEvent.setup();
      const mockSession = { access_token: 'test-token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
      });
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
      });
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      // Open modal & fill out confirmation
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }));
      await user.type(screen.getByPlaceholderText('Delete my account'), 'Delete my account');
      
      const confirmButton = screen.getByRole('button', { name: /confirm deletion/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        });
      });
      
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Your account has been deleted.', { id: 'toast-id' });
      });
    });

    it('shows error toast when account deletion fails', async () => {
      const user = userEvent.setup();
      const mockSession = { access_token: 'test-token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
      });
      
      // Simulating a failed network request
      (global.fetch as any).mockResolvedValue({
        ok: false,
      });
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }));
      await user.type(screen.getByPlaceholderText('Delete my account'), 'Delete my account');
      
      const confirmButton = screen.getByRole('button', { name: /confirm deletion/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete account', { id: 'toast-id' });
      });
      
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('disables modal buttons and shows spinner while deleting account', async () => {
      const user = userEvent.setup();
      const mockSession = { access_token: 'test-token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
      });
      
      let resolveDelete: any;
      (global.fetch as any).mockReturnValue(
        new Promise((resolve) => {
          resolveDelete = resolve;
        })
      );
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }));
      await user.type(screen.getByPlaceholderText('Delete my account'), 'Delete my account');
      
      const confirmButton = screen.getByRole('button', { name: /confirm deletion/i });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(confirmButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
        expect(document.querySelector('.animate-spin')).toBeInTheDocument(); // Loader2 icon
      });
      
      // Resolve the request
      resolveDelete({ ok: true });
      
      await waitFor(() => {
        // Modal closes on success, checking it disappears
        expect(screen.queryByText('Delete Account', { selector: 'h3' })).not.toBeInTheDocument();
      });
    });
  });
});