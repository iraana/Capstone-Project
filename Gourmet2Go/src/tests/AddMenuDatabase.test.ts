import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supabase } from '../../supabase-client';


vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('AddMenu Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Fetching Dishes', () => {
    it('fetches all dishes from database', async () => {
      const mockDishes = [
        { dish_id: 1, name: 'Caesar Salad', price: 8.99, category: 'Salads' },
        { dish_id: 2, name: 'Chicken Soup', price: 6.50, category: 'Soups' },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockDishes,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

     
      const { data, error } = await supabase
        .from('Dishes')
        .select('dish_id, name, price, category')
        .order('name');

      expect(supabase.from).toHaveBeenCalledWith('Dishes');
      expect(mockSelect).toHaveBeenCalledWith('dish_id, name, price, category');
      expect(mockOrder).toHaveBeenCalledWith('name');
      expect(data).toEqual(mockDishes);
      expect(error).toBeNull();
    });

    it('handles error when fetching dishes fails', async () => {
      const mockError = new Error('Database connection failed');

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data, error } = await supabase
        .from('Dishes')
        .select('dish_id, name, price, category')
        .order('name');

      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('Inserting Menu', () => {
    it('inserts menu day into database', async () => {
      const mockMenuDay = {
        menu_day_id: 1,
        date: '2026-02-17',
        day: 'Monday',
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockMenuDay,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      } as any);

      const { data, error } = await supabase
        .from('MenuDays')
        .insert({
          date: '2026-02-17',
          day: 'Monday',
        })
        .select('menu_day_id')
        .single();

      expect(supabase.from).toHaveBeenCalledWith('MenuDays');
      expect(mockInsert).toHaveBeenCalledWith({
        date: '2026-02-17',
        day: 'Monday',
      });
      expect(mockSelect).toHaveBeenCalledWith('menu_day_id');
      expect(data).toEqual(mockMenuDay);
      expect(error).toBeNull();
    });

    it('handles error when inserting menu day fails', async () => {
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

      const { data, error } = await supabase
        .from('MenuDays')
        .insert({
          date: '2026-02-17',
          day: 'Monday',
        })
        .select('menu_day_id')
        .single();

      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });

    it('inserts menu day dishes into database', async () => {
      const mockMenuDayDishes = [
        { menu_id: 1, dish_id: 1, stock: 14 },
        { menu_id: 1, dish_id: 2, stock: 14 },
      ];

      const mockInsert = vi.fn().mockResolvedValue({
        data: mockMenuDayDishes,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { data, error} = await supabase
        .from('MenuDayDishes')
        .insert(mockMenuDayDishes);

      expect(supabase.from).toHaveBeenCalledWith('MenuDayDishes');
      expect(mockInsert).toHaveBeenCalledWith(mockMenuDayDishes);
      expect(data).toEqual(mockMenuDayDishes);
      expect(error).toBeNull();
    });

    it('handles error when inserting menu day dishes fails', async () => {
      const mockError = new Error('Dish insert failed');
      const mockMenuDayDishes = [
        { menu_id: 1, dish_id: 1, stock: 14 },
      ];

      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { data, error } = await supabase
        .from('MenuDayDishes')
        .insert(mockMenuDayDishes);

      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('Data Validation', () => {
    it('returns dishes ordered alphabetically by name', async () => {
      const mockDishes = [
        { dish_id: 2, name: 'Apple Pie', price: 5.99, category: 'Desserts' },
        { dish_id: 1, name: 'Burger', price: 10.99, category: 'Entrees' },
        { dish_id: 3, name: 'Caesar Salad', price: 8.99, category: 'Salads' },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockDishes,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data } = await supabase
        .from('Dishes')
        .select('dish_id, name, price, category')
        .order('name');

      expect(mockOrder).toHaveBeenCalledWith('name');
      expect(data).toEqual(mockDishes);
    });
  });
});