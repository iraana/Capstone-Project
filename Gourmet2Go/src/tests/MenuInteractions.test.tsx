import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Menu } from '../components/Menu';


const mockAddItem = vi.fn();
const mockToggleCart = vi.fn();
const mockClearCart = vi.fn();


vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '123', email: 'user@saultcollege.ca' },
    role: 'USER',
  }),
}));


vi.mock('../store/cartStore', () => ({
  cartStore: () => ({
    addItem: mockAddItem,
    items: [],
    toggleCart: mockToggleCart,
    clearCart: mockClearCart,
    totalItems: vi.fn(() => 0),
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
    ],
  },
  {
    menu_day_id: 2,
    date: '2026-02-18',
    day: 'Tuesday',
    MenuDayDishes: [
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

describe('Menu Interactions - Add to Cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls addItem when Add to Cart button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);
    
    
    expect(mockAddItem).toHaveBeenCalledWith({
      dish_id: 1,
      name: 'Caesar Salad',
      price: 8.99,
      category: 'Salads',
      maxStock: 10,
      menu_id: 1,
    });
  });
});

describe('Menu Interactions - Day Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays Monday menu items by default', () => {
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Soup')).not.toBeInTheDocument();
  });

  it('switches to Tuesday menu when Tuesday tab is clicked', async () => {
  const user = userEvent.setup();
  
  render(
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );
  
 
  expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
  
 
  const tuesdayTab = screen.getByRole('button', { name: /tue/i });
  await user.click(tuesdayTab);
  
  
  expect(await screen.findByText('Chicken Soup')).toBeInTheDocument();
  expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
});

  it('highlights the selected day tab', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    );
    
    const tuesdayTab = screen.getByRole('button', { name: /tue/i });
    await user.click(tuesdayTab);
    
    
    expect(tuesdayTab).toHaveClass('bg-[#00659B]');
  });
});