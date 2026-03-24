import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SecurityTab } from '../components/account/SecurityTab';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { supabase } from '../../supabase-client';

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
    
   
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
   
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    
    global.fetch = vi.fn();
  });

  describe('Rendering', () => {
    it('renders the Security heading', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      expect(screen.getByText('Security')).toBeInTheDocument();
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
      expect(screen.getByRole('button', { name: /delete account/i })).toBeInTheDocument();
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

  describe('Delete Account', () => {
    it('shows confirmation dialog when clicking Delete Account', () => {
      render(<SecurityTab onClose={mockOnClose} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure? This action is irreversible. All your data and orders will be deleted.'
      );
    });

    it('does not delete account when confirmation is cancelled', async () => {
      vi.spyOn(window, 'confirm').mockImplementation(() => false);
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButton);
      
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('successfully deletes account and signs out user', async () => {
      const mockSession = { access_token: 'test-token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
      });
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
      });
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButton);
      
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
        expect(window.alert).toHaveBeenCalledWith('Your account has been deleted.');
      });
    });

    it('shows error alert when account deletion fails', async () => {
      const mockSession = { access_token: 'test-token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
      });
      
      (global.fetch as any).mockResolvedValue({
        ok: false,
      });
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Error deleting account.');
      });
      
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('shows loading spinner while deleting account', async () => {
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
      
      const deleteButton = screen.getByRole('button', { name: /delete account/i });
      fireEvent.click(deleteButton);
      
      
      await waitFor(() => {
        expect(deleteButton).toBeDisabled();
      });
      
      
      resolveDelete({ ok: true });
      
      
      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
      });
    });

    it('disables delete button while deletion is in progress', async () => {
      const mockSession = { access_token: 'test-token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
      });
      
      (global.fetch as any).mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100))
      );
      
      render(<SecurityTab onClose={mockOnClose} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete account/i });
      
      expect(deleteButton).not.toBeDisabled();
      
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(deleteButton).toBeDisabled();
      });
    });
  });
});