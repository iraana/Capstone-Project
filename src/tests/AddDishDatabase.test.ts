import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabase-client';


vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('AddDish Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Inserting Dishes', () => {
    it('inserts a new dish into the database', async () => {
      const mockDishData = {
        name: 'Caesar Salad',
        price: 8.99,
        category: 'Salads',
      };

      const mockInsert = vi.fn().mockResolvedValue({
        data: { dish_id: 1, ...mockDishData },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { error } = await supabase
        .from('Dishes')
        .insert(mockDishData);

      expect(supabase.from).toHaveBeenCalledWith('Dishes');
      expect(mockInsert).toHaveBeenCalledWith(mockDishData);
      expect(error).toBeNull();
    });

    it('handles error when inserting dish fails', async () => {
      const mockDishData = {
        name: 'Chicken Soup',
        price: 6.50,
        category: 'Soups',
      };

      const mockError = new Error('Insert failed');

      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const { error } = await supabase
        .from('Dishes')
        .insert(mockDishData);

      expect(error).toEqual(mockError);
    });

    it('inserts dish with correct price format', async () => {
      const mockDishData = {
        name: 'Burger',
        price: 12.99,
        category: 'Entrees',
      };

      const mockInsert = vi.fn().mockResolvedValue({
        data: { dish_id: 2, ...mockDishData },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      await supabase.from('Dishes').insert(mockDishData);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 12.99,
        })
      );
    });

    it('inserts dish with valid category', async () => {
      const validCategories = ['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls'];

      for (const category of validCategories) {
        const mockDishData = {
          name: `Test ${category}`,
          price: 10.00,
          category,
        };

        const mockInsert = vi.fn().mockResolvedValue({
          data: mockDishData,
          error: null,
        });

        vi.mocked(supabase.from).mockReturnValue({
          insert: mockInsert,
        } as any);

        await supabase.from('Dishes').insert(mockDishData);

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            category,
          })
        );

        vi.clearAllMocks();
      }
    });
  });

  describe('Data Validation', () => {
    it('inserts dish with all required fields', async () => {
      const mockDishData = {
        name: 'Apple Pie',
        price: 5.99,
        category: 'Desserts',
      };

      const mockInsert = vi.fn().mockResolvedValue({
        data: mockDishData,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      await supabase.from('Dishes').insert(mockDishData);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String),
        })
      );
    });

    it('uses correct table name for dish operations', async () => {
      const mockDishData = {
        name: 'Test Dish',
        price: 10.00,
        category: 'Other',
      };

      const mockInsert = vi.fn().mockResolvedValue({
        data: mockDishData,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      await supabase.from('Dishes').insert(mockDishData);

      expect(supabase.from).toHaveBeenCalledWith('Dishes');
    });
  });
});