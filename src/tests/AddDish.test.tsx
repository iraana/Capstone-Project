import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddDish } from '../components/admin/menu/AddDish.tsx';
import { supabase } from '../../supabase-client';
import { toast } from 'sonner';

const insertMock = vi.fn();

vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
}));

// Mock sonner to intercept the toast calls
vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AddDish component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('form submission + success message', async () => {
    insertMock.mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<AddDish />);

    await user.type(
      screen.getByPlaceholderText('Enter dish name'),
      'Sata Andagi'
    );

    await user.type(
      screen.getByPlaceholderText('0.00'),
      '12.95'
    );

    await user.selectOptions(
      screen.getByRole('combobox'),
      'Other'
    );

    await user.click(
      screen.getByRole('button', { name: /add dish/i })
    );

    // Wait for the form submission to finish and the success toast to be fired
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Dish added successfully!',
        { id: 'toast-id' }
      );
    });

    expect(supabase.from).toHaveBeenCalledWith('Dishes');

    expect(insertMock).toHaveBeenCalledWith({
      name: 'Sata Andagi',
      price: 12.95,
      category: 'Other',
    });
  });

  it('shows error toast if insertion fails', async () => {
    insertMock.mockResolvedValueOnce({ 
      error: { message: 'Database error occurred' } 
    });

    const user = userEvent.setup();
    render(<AddDish />);

    await user.type(
      screen.getByPlaceholderText('Enter dish name'),
      'Bad Dish'
    );

    await user.type(
      screen.getByPlaceholderText('0.00'),
      '5.99'
    );

    await user.selectOptions(
      screen.getByRole('combobox'),
      'Sides'
    );

    await user.click(
      screen.getByRole('button', { name: /add dish/i })
    );

    // Wait for the error toast to be fired
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Database error occurred',
        { id: 'toast-id' }
      );
    });
  });
});