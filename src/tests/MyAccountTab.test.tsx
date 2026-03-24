import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MyAccountTab } from '../components/account/MyAccountTab';
import { useAuth } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../../supabase-client';


vi.mock('../context/AuthContext');
vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('MyAccountTab', () => {
  let queryClient: QueryClient;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@saultcollege.ca',
  };

  const mockProfile = {
    id: 'test-user-id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'test@saultcollege.ca',
    role: 'USER',
  };

  const mockAdminProfile = {
    id: 'admin-user-id',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@saultcollege.ca',
    role: 'ADMIN',
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
      data: mockProfile,
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: mockSelect,
      update: vi.fn().mockReturnThis(),
      eq: mockEq,
    });

    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
      eq: mockEq,
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MyAccountTab />
      </QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('renders My Account heading', () => {
      renderComponent();
      expect(screen.getByText('My Account')).toBeInTheDocument();
    });

    it('shows loading spinner while fetching profile', () => {
      renderComponent();
      
      const loader = document.querySelector('.animate-spin');
      expect(loader).toBeTruthy();
    });

    it('displays profile information after loading', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      });
    });

    it('shows admin badge when user is admin', async () => {
      const mockAdminSelect = vi.fn().mockReturnThis();
      const mockAdminEq = vi.fn().mockReturnThis();
      const mockAdminSingle = vi.fn().mockResolvedValue({
        data: mockAdminProfile,
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        select: mockAdminSelect,
        update: vi.fn().mockReturnThis(),
        eq: mockAdminEq,
      });

      mockAdminSelect.mockReturnValue({
        eq: mockAdminEq,
      });

      mockAdminEq.mockReturnValue({
        single: mockAdminSingle,
        eq: mockAdminEq,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Admin')).toBeInTheDocument();
      });
    });

    it('shows disabled email field with user email', async () => {
      renderComponent();

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@saultcollege.ca');
        expect(emailInput).toBeDisabled();
      });
    });

    it('shows Profile Information section', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Profile Information')).toBeInTheDocument();
      });
    });
  });

  describe('Form Fields', () => {
    it('first name field is editable', async () => {
      renderComponent();

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue('John');
        expect(firstNameInput).not.toBeDisabled();
      });
    });

    it('last name field is editable', async () => {
      renderComponent();

      await waitFor(() => {
        const lastNameInput = screen.getByDisplayValue('Doe');
        expect(lastNameInput).not.toBeDisabled();
      });
    });

    it('shows validation error for empty first name', async () => {
      renderComponent();

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue('John');
        fireEvent.change(firstNameInput, { target: { value: '' } });
      });

     
      const saveButton = await screen.findByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
    });

    it('shows validation error for empty last name', async () => {
      renderComponent();

      await waitFor(() => {
        const lastNameInput = screen.getByDisplayValue('Doe');
        fireEvent.change(lastNameInput, { target: { value: '' } });
      });

      
      const saveButton = await screen.findByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
    });
  });

  describe('Save Changes', () => {
    it('shows unsaved changes banner when form is dirty', async () => {
      renderComponent();

      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue('John');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

      await waitFor(() => {
        expect(screen.getByText(/you have unsaved changes/i)).toBeInTheDocument();
      });
    });

    it('reset button clears changes', async () => {
      renderComponent();

      
      await waitFor(() => {
        const firstNameInput = screen.getByDisplayValue('John');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

     
      const resetButton = await screen.findByText('Reset');
      fireEvent.click(resetButton);

      
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });
    });

    it('save button submits form successfully', async () => {
      renderComponent();

      
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      
      const mockUpdate = vi.fn();
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      mockUpdate.mockReturnValue({ eq: mockEq });

      
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
      });

      
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

     
      await waitFor(() => {
        expect(screen.getByText('Save Changes')).toBeInTheDocument();
      });

      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith({
          first_name: 'Jane',
          last_name: 'Doe',
        });
      }, { timeout: 2000 });
    });

    it('shows loading spinner on save button while saving', async () => {
      renderComponent();

      
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      
      const mockUpdate = vi.fn();
      const mockEq = vi.fn();
      mockEq.mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      mockUpdate.mockReturnValue({ eq: mockEq });

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
      });

      
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

     
      await waitFor(() => {
        expect(screen.getByText('Save Changes')).toBeInTheDocument();
      });

     
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      
      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      }, { timeout: 2000 });
    });
  });

  describe('Profile Display', () => {
    it('displays user full name in header', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('displays user email below name', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getAllByText('test@saultcollege.ca').length).toBeGreaterThan(0);
      });
    });
  });
});