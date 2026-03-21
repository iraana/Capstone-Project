import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddDish } from '../components/admin/AddDish';
import { supabase } from '../../supabase-client';

const insertMock = vi.fn();

vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: insertMock,
    })),
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

    expect(
      await screen.findByText('Dish added successfully!')
    ).toBeInTheDocument();

    expect(supabase.from).toHaveBeenCalledWith('Dishes');

    expect(insertMock).toHaveBeenCalledWith({
      name: 'Sata Andagi',
      price: 12.95,
      category: 'Other',
    });
  });
});
