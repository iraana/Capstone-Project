import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../supabase-client';

vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Menu Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Fetching Menu Days with Dishes', () => {
    it('fetches menu days with nested dishes', async () => {
      const mockMenuDays = [
        {
          menu_day_id: 1,
          date: '2026-02-17',
          day: 'Monday',
          MenuDayDishes: [
            {
              menu_day_dish_id: 1,
              stock: 14,
              Dishes: {
                dish_id: 1,
                name: 'Caesar Salad',
                category: 'Salads',
                price: 8.99,
              },
            },
          ],
        },
        {
          menu_day_id: 2,
          date: '2026-02-18',
          day: 'Tuesday',
          MenuDayDishes: [
            {
              menu_day_dish_id: 2,
              stock: 10,
              Dishes: {
                dish_id: 2,
                name: 'Chicken Soup',
                category: 'Soups',
                price: 6.50,
              },
            },
          ],
        },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockMenuDays,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data, error } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      expect(supabase.from).toHaveBeenCalledWith('MenuDays');
      expect(mockOrder).toHaveBeenCalledWith('date', { ascending: true });
      expect(data).toEqual(mockMenuDays);
      expect(error).toBeNull();
    });

    it('returns menu days ordered by date ascending', async () => {
      const mockMenuDays = [
        { menu_day_id: 1, date: '2026-02-17', day: 'Monday', MenuDayDishes: [] },
        { menu_day_id: 2, date: '2026-02-18', day: 'Tuesday', MenuDayDishes: [] },
        { menu_day_id: 3, date: '2026-02-19', day: 'Wednesday', MenuDayDishes: [] },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockMenuDays,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      expect(mockOrder).toHaveBeenCalledWith('date', { ascending: true });
      expect(data).toEqual(mockMenuDays);
     
      expect(data![0].date).toBe('2026-02-17');
      expect(data![1].date).toBe('2026-02-18');
      expect(data![2].date).toBe('2026-02-19');
    });

    it('handles empty menu days', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data, error } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      expect(data).toEqual([]);
      expect(error).toBeNull();
    });

    it('handles error when fetching menu days fails', async () => {
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
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('Menu Data Structure', () => {
    it('returns menu with multiple dishes per day', async () => {
  const mockMenuDay = {
    menu_day_id: 1,
    date: '2026-02-17',
    day: 'Monday' as const,
    MenuDayDishes: [
      {
        menu_day_dish_id: 1,
        stock: 14,
        Dishes: {
          dish_id: 1,
          name: 'Caesar Salad',
          category: 'Salads' as const,
          price: 8.99,
        },
      },
      {
        menu_day_dish_id: 2,
        stock: 10,
        Dishes: {
          dish_id: 2,
          name: 'Chicken Soup',
          category: 'Soups' as const,
          price: 6.50,
        },
      },
      {
        menu_day_dish_id: 3,
        stock: 12,
        Dishes: {
          dish_id: 3,
          name: 'Burger',
          category: 'Entrees' as const,
          price: 12.99,
        },
      },
    ],
  };

  const mockSelect = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockResolvedValue({
    data: [mockMenuDay],
    error: null,
  });

  vi.mocked(supabase.from).mockReturnValue({
    select: mockSelect,
    order: mockOrder,
  } as any);

  const { data } = await supabase
    .from('MenuDays')
    .select(`
      menu_day_id,
      date,
      day,
      MenuDayDishes (
        menu_day_dish_id,
        stock,
        Dishes (
          dish_id,
          name,
          category,
          price
        )
      )
    `)
    .order('date', { ascending: true });

  expect(data).toHaveLength(1);
  expect(data![0].MenuDayDishes).toHaveLength(3);
  expect(data![0].MenuDayDishes[0].Dishes.name).toBe('Caesar Salad');
  expect(data![0].MenuDayDishes[1].Dishes.name).toBe('Chicken Soup');
  expect(data![0].MenuDayDishes[2].Dishes.name).toBe('Burger');
});

    it('returns menu day with no dishes', async () => {
      const mockMenuDay = {
        menu_day_id: 1,
        date: '2026-02-17',
        day: 'Monday',
        MenuDayDishes: [],
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockMenuDay],
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      expect(data).toHaveLength(1);
      expect(data![0].MenuDayDishes).toEqual([]);
    });

    it('includes all required dish fields', async () => {
      const mockMenuDay = {
        menu_day_id: 1,
        date: '2026-02-17',
        day: 'Monday',
        MenuDayDishes: [
          {
            menu_day_dish_id: 1,
            stock: 14,
            Dishes: {
              dish_id: 1,
              name: 'Caesar Salad',
              category: 'Salads',
              price: 8.99,
            },
          },
        ],
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockMenuDay],
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      } as any);

      const { data } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });

      const dish = data![0].MenuDayDishes[0].Dishes;
      expect(dish).toHaveProperty('dish_id');
      expect(dish).toHaveProperty('name');
      expect(dish).toHaveProperty('category');
      expect(dish).toHaveProperty('price');
    });
  });
});