import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Menu } from '../components/Menu';
import { supabase } from '../../supabase-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../supabase-client', () => {
  const gteMock = vi.fn().mockReturnThis();
  const lteMock = vi.fn().mockReturnThis();
  const orderMock = vi.fn().mockResolvedValue({ data: [], error: null });

  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          gte: gteMock,
          lte: lteMock,
          order: orderMock,
        })),
      })),
    },
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    role: null,
  }),
}));

vi.mock('../store/cartStore', () => ({
  cartStore: () => ({
    addItem: vi.fn(),
    items: [],
    clearCart: vi.fn(),
    totalItems: vi.fn(() => 0),
  }),
}));

describe('Menu noon cutoff', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts from tomorrow after noon EST', async () => {
    vi.useFakeTimers();
    // 5:01 PM UTC which is 12:01 PM EST and 1:01 PM EDT 
    vi.setSystemTime(new Date('2026-03-31T17:01:00Z')); 

    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Menu />
            </BrowserRouter>
        </QueryClientProvider>
    );

    const fromMock = supabase.from as any;
    const selectCall = fromMock.mock.results[0].value.select();
    const gteCall = selectCall.gte.mock.calls[0];
    const startDate = new Date(gteCall[1]);
    expect(startDate.getUTCDate()).toBe(1); 
    vi.useRealTimers();
  });

});