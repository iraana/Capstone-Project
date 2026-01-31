import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddDish } from '../components/admin/AddDish';
import { supabase } from '../../supabase-client';

const insertMock = vi.fn(() => ({
  select: vi.fn(async () => ({
    data: null,
    error: null,
  })),
}));

vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
}));

describe('AddDish component', () => {
  it('form submission + success message', async () => {
    const user = userEvent.setup();

    render(<AddDish />);

    await user.type(
      screen.getByPlaceholderText('Dish Name'),
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