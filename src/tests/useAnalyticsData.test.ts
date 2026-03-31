import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { supabase } from '../../supabase-client';

vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
  return Wrapper;
};

describe('useAnalyticsData', () => {
  let queryClient: QueryClient;
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    wrapper = createWrapper(queryClient); 
  });

  const mockSupabaseResponse = (orders: any[], menuDays: any[]) => {
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'Orders') {
        return {
          select: vi.fn().mockReturnValue({
            neq: vi.fn().mockReturnValue({
              neq: vi.fn().mockResolvedValue({ data: orders, error: null }),
            }),
          }),
        };
      }
      if (table === 'MenuDays') {
        return {
          select: vi.fn().mockResolvedValue({ data: menuDays, error: null }),
        };
      }
    });
  };

  describe('Empty State', () => {
    it('returns empty state when there is no data', async () => {
      mockSupabaseResponse([], []);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dishStats).toEqual([]);
      expect(result.current.buyerStats).toEqual([]);
      expect(result.current.buyerStatsByOrders).toEqual([]);
      expect(result.current.timeStats).toEqual([]);
      expect(result.current.trendStats).toEqual([]);
      expect(result.current.dayStats).toEqual([]);
      expect(result.current.kpis).toBeNull();
      expect(result.current.dayHourMatrix).toEqual(
        Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0))
      );
      expect(result.current.dayHourMax).toBe(0);
    });

    it('handles loading state correctly', async () => {
      mockSupabaseResponse([], []);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('handles error state correctly', async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            neq: vi.fn().mockResolvedValue({ 
              data: null, 
              error: new Error('Database error') 
            }),
          }),
        }),
      }));

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.error).toBeTruthy());
    });
  });

  describe('Single Order Calculations', () => {
    it('calculates dish stats correctly for single order', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:30:00Z',
        total: 15.99,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'John', last_name: 'Doe', email: 'john@test.com' },
        OrderItems: [
          { 
            quantity: 2, 
            dish_id: 1, 
            Dishes: { name: 'Pasta', price: 7.99 } 
          }
        ]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dishStats).toHaveLength(1);
      expect(result.current.dishStats[0]).toEqual({
        name: 'Pasta',
        quantity: 2,
        revenue: 15.98
      });
    });

    it('calculates buyer stats correctly for single order', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:30:00Z',
        total: 25.50,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'Alice', last_name: 'Smith', email: 'alice@test.com' },
        OrderItems: [
          { quantity: 1, dish_id: 1, Dishes: { name: 'Burger', price: 10.99 } },
          { quantity: 1, dish_id: 2, Dishes: { name: 'Fries', price: 4.99 } }
        ]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.buyerStats).toHaveLength(1);
      expect(result.current.buyerStats[0]).toMatchObject({
        id: 'user1',
        name: 'Alice Smith',
        orders: 1,
        spent: 25.50
      });
    });

    it('calculates KPIs correctly for single order', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T14:30:00Z',
        total: 30.00,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'Bob', last_name: 'Jones', email: 'bob@test.com' },
        OrderItems: [
          { quantity: 3, dish_id: 1, Dishes: { name: 'Pizza', price: 10.00 } }
        ]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.kpis).toBeTruthy();
      expect(result.current.kpis.totalRevenue).toBe(30.00);
      expect(result.current.kpis.aov).toBe(30.00);
      expect(result.current.kpis.avgBasketSize).toBe(3);
      expect(result.current.kpis.repeatCustomerRate).toBe(0);
    });
  });

  describe('Multiple Orders Calculations', () => {
    it('sorts dishes by quantity correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 20,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
          OrderItems: [
            { quantity: 5, dish_id: 1, Dishes: { name: 'Salad', price: 8.00 } }
          ]
        },
        {
          order_id: 2,
          timestamp: '2024-03-20T13:00:00Z',
          total: 15,
          user_id: 'user2',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
          OrderItems: [
            { quantity: 2, dish_id: 2, Dishes: { name: 'Soup', price: 6.00 } }
          ]
        }
      ];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dishStats[0].name).toBe('Salad');
      expect(result.current.dishStats[0].quantity).toBe(5);
      expect(result.current.dishStats[1].name).toBe('Soup');
      expect(result.current.dishStats[1].quantity).toBe(2);
    });

    it('sorts buyers by spending correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 50,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'Big', last_name: 'Spender', email: 'big@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 1, Dishes: { name: 'Steak', price: 50 } }
          ]
        },
        {
          order_id: 2,
          timestamp: '2024-03-20T13:00:00Z',
          total: 10,
          user_id: 'user2',
          menu_id: 1,
          profiles: { first_name: 'Small', last_name: 'Buyer', email: 'small@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 2, Dishes: { name: 'Snack', price: 10 } }
          ]
        }
      ];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.buyerStats[0].name).toBe('Big Spender');
      expect(result.current.buyerStats[0].spent).toBe(50);
      expect(result.current.buyerStats[1].name).toBe('Small Buyer');
      expect(result.current.buyerStats[1].spent).toBe(10);
    });

    it('calculates repeat customer rate correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 20,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'Repeat', last_name: 'Customer', email: 'repeat@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 1, Dishes: { name: 'Dish1', price: 20 } }
          ]
        },
        {
          order_id: 2,
          timestamp: '2024-03-21T12:00:00Z',
          total: 20,
          user_id: 'user1',
          menu_id: 2,
          profiles: { first_name: 'Repeat', last_name: 'Customer', email: 'repeat@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 1, Dishes: { name: 'Dish1', price: 20 } }
          ]
        },
        {
          order_id: 3,
          timestamp: '2024-03-22T12:00:00Z',
          total: 15,
          user_id: 'user2',
          menu_id: 3,
          profiles: { first_name: 'One', last_name: 'Time', email: 'onetime@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 2, Dishes: { name: 'Dish2', price: 15 } }
          ]
        }
      ];

      const menuDays = [
        { menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' },
        { menu_day_id: 2, date: '2024-03-21', day: 'Thursday' },
        { menu_day_id: 3, date: '2024-03-22', day: 'Friday' }
      ];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.kpis.repeatCustomerRate).toBe(50);
    });

    it('calculates average basket size correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 30,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
          OrderItems: [
            { quantity: 3, dish_id: 1, Dishes: { name: 'Item1', price: 10 } }
          ]
        },
        {
          order_id: 2,
          timestamp: '2024-03-20T13:00:00Z',
          total: 15,
          user_id: 'user2',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 2, Dishes: { name: 'Item2', price: 15 } }
          ]
        }
      ];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.kpis.avgBasketSize).toBe(2);
    });
  });

  describe('Revenue Trends', () => {
    it('groups revenue by date correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 100,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 100 } }
          ]
        },
        {
          order_id: 2,
          timestamp: '2024-03-21T12:00:00Z',
          total: 50,
          user_id: 'user2',
          menu_id: 2,
          profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
          OrderItems: [
            { quantity: 1, dish_id: 2, Dishes: { name: 'Dish2', price: 50 } }
          ]
        }
      ];

      const menuDays = [
        { menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' },
        { menu_day_id: 2, date: '2024-03-21', day: 'Thursday' }
      ];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.trendStats).toHaveLength(2);
      expect(result.current.trendStats[0]).toMatchObject({
        date: '2024-03-20',
        revenue: 100,
        orders: 1,
        aov: 100
      });
      expect(result.current.trendStats[1]).toMatchObject({
        date: '2024-03-21',
        revenue: 50,
        orders: 1,
        aov: 50
      });
    });

    it('sorts trend stats by date in ascending order', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-22T12:00:00Z',
          total: 30,
          user_id: 'user1',
          menu_id: 3,
          profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 30 } }]
        },
        {
          order_id: 2,
          timestamp: '2024-03-20T12:00:00Z',
          total: 10,
          user_id: 'user2',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 2, Dishes: { name: 'Dish2', price: 10 } }]
        }
      ];

      const menuDays = [
        { menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' },
        { menu_day_id: 3, date: '2024-03-22', day: 'Friday' }
      ];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.trendStats[0].date).toBe('2024-03-20');
      expect(result.current.trendStats[1].date).toBe('2024-03-22');
    });
  });

  describe('Day of Week Statistics', () => {
    it('groups revenue by day of week correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 100,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 100 } }]
        },
        {
          order_id: 2,
          timestamp: '2024-03-21T12:00:00Z',
          total: 50,
          user_id: 'user2',
          menu_id: 2,
          profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 2, Dishes: { name: 'Dish2', price: 50 } }]
        }
      ];

      const menuDays = [
        { menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' },
        { menu_day_id: 2, date: '2024-03-21', day: 'Thursday' }
      ];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const wednesday = result.current.dayStats.find(d => d.day === 'Wednesday');
      const thursday = result.current.dayStats.find(d => d.day === 'Thursday');

      expect(wednesday?.revenue).toBe(100);
      expect(wednesday?.orders).toBe(1);
      expect(thursday?.revenue).toBe(50);
      expect(thursday?.orders).toBe(1);
    });

    it('maintains all 7 days of week even with no data for some days', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:00:00Z',
        total: 50,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 50 } }]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dayStats).toHaveLength(7);
      const daysWithNoOrders = result.current.dayStats.filter(d => d.revenue === 0);
      expect(daysWithNoOrders).toHaveLength(6);
    });
  });

  describe('Time Statistics', () => {
  it('tracks orders by hour correctly', async () => {
    const orders = [
      {
        order_id: 1,
        timestamp: '2024-03-20T12:30:00-04:00',
        total: 20,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Lunch', price: 20 } }]
      },
      {
        order_id: 2,
        timestamp: '2024-03-20T12:45:00-04:00',
        total: 15,
        user_id: 'user2',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 2, Dishes: { name: 'Lunch2', price: 15 } }]
      }
    ];

    const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

    mockSupabaseResponse(orders, menuDays);

    const { result } = renderHook(() => useAnalyticsData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should have at least one time stat entry
    expect(result.current.timeStats.length).toBeGreaterThan(0);
    // Both orders should be counted
    const totalOrders = result.current.timeStats.reduce((sum, t) => sum + t.count, 0);
    expect(totalOrders).toBe(2);
  });

  it('calculates peak time correctly', async () => {
    const orders = [
      {
        order_id: 1,
        timestamp: '2024-03-20T12:00:00-04:00',
        total: 20,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Lunch', price: 20 } }]
      },
      {
        order_id: 2,
        timestamp: '2024-03-20T12:30:00-04:00',
        total: 15,
        user_id: 'user2',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'Two', email: 'u2@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 2, Dishes: { name: 'Lunch2', price: 15 } }]
      },
      {
        order_id: 3,
        timestamp: '2024-03-20T13:00:00-04:00',
        total: 10,
        user_id: 'user3',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'Three', email: 'u3@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 3, Dishes: { name: 'Snack', price: 10 } }]
      }
    ];

    const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

    mockSupabaseResponse(orders, menuDays);

    const { result } = renderHook(() => useAnalyticsData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should have a peak time defined
    expect(result.current.kpis.peakTime).toBeTruthy();
    expect(typeof result.current.kpis.peakTime).toBe('string');
  });
});

  describe('Edge Cases', () => {
    it('handles orders with missing profile names', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:00:00Z',
        total: 25,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: '', last_name: '', email: 'unknown@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 25 } }]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.buyerStats[0].name).toBe('unknown@test.com');
    });

    it('handles orders with missing dish prices', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:00:00Z',
        total: 20,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
        OrderItems: [
          { quantity: 1, dish_id: 1, Dishes: { name: 'Mystery Dish', price: null } }
        ]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dishStats[0].revenue).toBe(20);
    });

    it('handles multiple items in same order correctly', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:00:00Z',
        total: 25,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
        OrderItems: [
          { quantity: 2, dish_id: 1, Dishes: { name: 'Burger', price: 10 } },
          { quantity: 1, dish_id: 2, Dishes: { name: 'Fries', price: 5 } }
        ]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dishStats).toHaveLength(2);
      const burger = result.current.dishStats.find(d => d.name === 'Burger');
      const fries = result.current.dishStats.find(d => d.name === 'Fries');
      
      expect(burger?.quantity).toBe(2);
      expect(fries?.quantity).toBe(1);
    });

    it('handles day/hour matrix correctly', async () => {
      const orders = [{
        order_id: 1,
        timestamp: '2024-03-20T12:00:00-05:00',
        total: 20,
        user_id: 'user1',
        menu_id: 1,
        profiles: { first_name: 'User', last_name: 'One', email: 'u1@test.com' },
        OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Lunch', price: 20 } }]
      }];

      const menuDays = [{ menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' }];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.dayHourMatrix).toHaveLength(7);
      expect(result.current.dayHourMatrix[0]).toHaveLength(24);
      expect(result.current.dayHourMax).toBeGreaterThan(0);
    });

    it('calculates buyers sorted by order count correctly', async () => {
      const orders = [
        {
          order_id: 1,
          timestamp: '2024-03-20T12:00:00Z',
          total: 10,
          user_id: 'user1',
          menu_id: 1,
          profiles: { first_name: 'Frequent', last_name: 'Buyer', email: 'freq@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 10 } }]
        },
        {
          order_id: 2,
          timestamp: '2024-03-21T12:00:00Z',
          total: 10,
          user_id: 'user1',
          menu_id: 2,
          profiles: { first_name: 'Frequent', last_name: 'Buyer', email: 'freq@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 1, Dishes: { name: 'Dish', price: 10 } }]
        },
        {
          order_id: 3,
          timestamp: '2024-03-22T12:00:00Z',
          total: 100,
          user_id: 'user2',
          menu_id: 3,
          profiles: { first_name: 'Big', last_name: 'Spender', email: 'big@test.com' },
          OrderItems: [{ quantity: 1, dish_id: 2, Dishes: { name: 'Expensive', price: 100 } }]
        }
      ];

      const menuDays = [
        { menu_day_id: 1, date: '2024-03-20', day: 'Wednesday' },
        { menu_day_id: 2, date: '2024-03-21', day: 'Thursday' },
        { menu_day_id: 3, date: '2024-03-22', day: 'Friday' }
      ];

      mockSupabaseResponse(orders, menuDays);

      const { result } = renderHook(() => useAnalyticsData(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.buyerStatsByOrders[0].name).toBe('Frequent Buyer');
      expect(result.current.buyerStatsByOrders[0].orders).toBe(2);
    });
  });
});

// Comment so I can commit this change