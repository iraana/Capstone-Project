import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Menu } from '../components/Menu';


vi.mock('../../supabase-client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  },
}));


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
  }),
}));


const mockMenuData = [
  {
    menu_day_id: 1,
    date: '2026-02-17',
    day: 'Monday',
    MenuDayDishes: [
      {
        menu_day_dish_id: 1,
        stock: 10,
        Dishes: {
          dish_id: 1,
          name: 'Caesar Salad',
          category: 'Salads',
          price: 8.99,
        },
      },
      {
        menu_day_dish_id: 2,
        stock: 5,
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

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: mockMenuData,
    isLoading: false,
    error: null,
  }),
}));

describe('Menu component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Menu component', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    

    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('Chicken Soup')).toBeInTheDocument();
  });

  it('displays menu items with correct prices', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    expect(screen.getByText('$8.99')).toBeInTheDocument();
    expect(screen.getByText('$6.50')).toBeInTheDocument();
  });

  it('displays menu items with correct categories', () => {
  render(
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );
  
  expect(screen.getAllByText('Salads').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Soups').length).toBeGreaterThan(0);
});

  it('displays stock information for menu items', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    expect(screen.getByText('10 remaining')).toBeInTheDocument();
    expect(screen.getByText('5 remaining')).toBeInTheDocument();
  });

  it('shows Locked button when user is not logged in', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    const lockedButtons = screen.getAllByText('Locked');
    expect(lockedButtons.length).toBeGreaterThan(0);
  });

  it('displays the menu day tabs', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });
});