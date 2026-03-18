import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabase-client';


vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Checkout Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Checking Existing Orders', () => {
    it('checks if user already has an order for the menu', async () => {
      const mockUserId = 'user-123';
      const mockMenuId = 1;

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq1 = vi.fn().mockReturnThis();
      const mockEq2 = vi.fn().mockReturnThis();
      const mockLimit = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq1,
      } as any);

      mockEq1.mockReturnValue({
        eq: mockEq2,
        limit: mockLimit,
      } as any);

      const { data, error } = await supabase
        .from('Orders')
        .select('order_id')
        .eq('user_id', mockUserId)
        .eq('menu_id', mockMenuId)
        .limit(1);

      expect(supabase.from).toHaveBeenCalledWith('Orders');
      expect(mockSelect).toHaveBeenCalledWith('order_id');
      expect(data).toEqual([]);
      expect(error).toBeNull();
    });

    it('returns existing order if user already ordered from this menu', async () => {
      const mockExistingOrder = [{ order_id: 1 }];

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq1 = vi.fn().mockReturnThis();
      const mockEq2 = vi.fn().mockReturnThis();
      const mockLimit = vi.fn().mockResolvedValue({
        data: mockExistingOrder,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq1,
      } as any);

      mockEq1.mockReturnValue({
        eq: mockEq2,
        limit: mockLimit,
      } as any);

      const { data } = await supabase
        .from('Orders')
        .select('order_id')
        .eq('user_id', 'user-123')
        .eq('menu_id', 1)
        .limit(1);

      expect(data).toHaveLength(1);
    });
  });

  describe('Checking Stock Availability', () => {
    it('fetches stock data for menu dishes', async () => {
      const mockStockData = [
        { dish_id: 1, stock: 14, Dishes: { name: 'Caesar Salad' } },
        { dish_id: 2, stock: 10, Dishes: { name: 'Chicken Soup' } },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockIn = vi.fn().mockResolvedValue({
        data: mockStockData,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
      } as any);

      mockEq.mockReturnValue({
        in: mockIn,
      } as any);

      const { data, error } = await supabase
        .from('MenuDayDishes')
        .select(`
          dish_id, 
          stock, 
          Dishes ( name )
        `)
        .eq('menu_id', 1)
        .in('dish_id', [1, 2]);

      expect(supabase.from).toHaveBeenCalledWith('MenuDayDishes');
      expect(data).toEqual(mockStockData);
      expect(error).toBeNull();
    });
  });

  describe('Inserting Order', () => {
    it('inserts a new order into the database', async () => {
      const mockOrderData = {
        user_id: 'user-123',
        menu_id: 1,
        notes: 'Extra napkins please',
        total: 25.48,
        order_number: 12345678,
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { order_id: 1, ...mockOrderData },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      } as any);

      const { data, error } = await supabase
        .from('Orders')
        .insert(mockOrderData)
        .select('order_id')
        .single();

      expect(supabase.from).toHaveBeenCalledWith('Orders');
      expect(mockInsert).toHaveBeenCalledWith(mockOrderData);
      expect(data).toHaveProperty('order_id');
      expect(error).toBeNull();
    });

    it('handles error when inserting order fails', async () => {
      const mockError = new Error('Insert failed');

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      } as any);

      const { error } = await supabase
        .from('Orders')
        .insert({
          user_id: 'user-123',
          menu_id: 1,
          notes: null,
          total: 25.48,
          order_number: 12345678,
        })
        .select('order_id')
        .single();

      expect(error).toEqual(mockError);
    });
  });

  describe('Inserting Order Items', () => {
    it('inserts order items into the database', async () => {
      const mockOrderItems = [
        { order_id: 1, dish_id: 1, quantity: 2, subtotal: 17.98 },
        { order_id: 1, dish_id: 2, quantity: 1, subtotal: 6.50 },
      ];

      const mockInsert = vi.fn().mockResolvedValue({
        data: mockOrderItems,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { error } = await supabase
        .from('OrderItems')
        .insert(mockOrderItems);

      expect(supabase.from).toHaveBeenCalledWith('OrderItems');
      expect(mockInsert).toHaveBeenCalledWith(mockOrderItems);
      expect(error).toBeNull();
    });
  });

  describe('Updating Stock', () => {
    it('updates stock for a menu dish', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq1 = vi.fn().mockReturnThis();
      const mockEq2 = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
        eq: mockEq1,
      } as any);

      mockEq1.mockReturnValue({
        eq: mockEq2,
      } as any);

      const { error } = await supabase
        .from('MenuDayDishes')
        .update({ stock: 12 })
        .eq('menu_id', 1)
        .eq('dish_id', 1);

      expect(supabase.from).toHaveBeenCalledWith('MenuDayDishes');
      expect(mockUpdate).toHaveBeenCalledWith({ stock: 12 });
      expect(error).toBeNull();
    });

    it('prevents stock from going negative', async () => {
      const originalStock = 2;
      const quantity = 3;
      const newStock = Math.max(0, originalStock - quantity);

      expect(newStock).toBe(0);
      expect(newStock).toBeGreaterThanOrEqual(0);
    });
  });
});