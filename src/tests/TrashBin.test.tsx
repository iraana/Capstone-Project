import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TrashBin } from '../components/admin/menu/TrashBin';
import { supabase } from '../../supabase-client';

vi.mock('../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockConfirm = vi.fn();
const mockAlert = vi.fn();
global.window.confirm = mockConfirm;
global.window.alert = mockAlert;

describe('TrashBin', () => {
  let queryClient: QueryClient;

  const mockDishes = [
    { dish_id: 1, name: 'Pasta Carbonara', price: 12.99, category: 'Main', dish_status: false },
    { dish_id: 2, name: 'Caesar Salad', price: 8.99, category: 'Appetizer', dish_status: false },
  ];

  const mockMenus = [
    { menu_day_id: 1, date: '2024-03-20', day: 'Wednesday', status: false },
    { menu_day_id: 2, date: '2024-03-21', day: 'Thursday', status: false },
  ];

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  describe('Loading State', () => {
    it('displays loader while fetching data', () => {
  const mockFrom = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => new Promise(() => {})), // Never resolves
      })),
    })),
  }));

  (supabase.from as any) = mockFrom;

  const { container } = render(<TrashBin />, { wrapper: createWrapper() });

  expect(container.querySelector('.lucide-loader-circle')).toBeInTheDocument();
});
    });

  describe('Error States', () => {
    it('displays error message when dishes fail to load', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'Dishes') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.reject(new Error('Failed to load dishes'))),
              })),
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        };
      });

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/error loading dishes/i)).toBeInTheDocument();
      });
    });

    it('displays error message when menus fail to load', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'MenuDays') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.reject(new Error('Failed to load menus'))),
              })),
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        };
      });

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/error loading menus/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('displays "No deleted dishes" when dishes array is empty', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('No deleted dishes')).toBeInTheDocument();
      });
    });

    it('displays "No deleted menus" when menus array is empty', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('No deleted menus')).toBeInTheDocument();
      });
    });
  });

  describe('Component Rendering with Data', () => {
    it('renders deleted dishes correctly', async () => {
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'Dishes' ? mockDishes : [],
                error: null,
              })
            ),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
        expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
        expect(screen.getByText(/Main • \$12.99/)).toBeInTheDocument();
      });
    });

    it('renders deleted menus correctly', async () => {
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'MenuDays' ? mockMenus : [],
                error: null,
              })
            ),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Wednesday — 2024-03-20/)).toBeInTheDocument();
        expect(screen.getByText(/Thursday — 2024-03-21/)).toBeInTheDocument();
      });
    });

    it('displays section headers', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Deleted Dishes')).toBeInTheDocument();
        expect(screen.getByText('Deleted Menus')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters dishes by name when searching', async () => {
      const user = userEvent.setup();
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'Dishes' ? mockDishes : [],
                error: null,
              })
            ),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search deleted dishes...');
      await user.type(searchInput, 'pasta');

      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
    });

    it('filters dishes by category when searching', async () => {
      const user = userEvent.setup();
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'Dishes' ? mockDishes : [],
                error: null,
              })
            ),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search deleted dishes...');
      await user.type(searchInput, 'appetizer');

      expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });

    it('filters menus by day when searching', async () => {
      const user = userEvent.setup();
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'MenuDays' ? mockMenus : [],
                error: null,
              })
            ),
          })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Wednesday/)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search deleted menus by date or day...');
      await user.type(searchInput, 'wednesday');

      expect(screen.getByText(/Wednesday — 2024-03-20/)).toBeInTheDocument();
      expect(screen.queryByText(/Thursday/)).not.toBeInTheDocument();
    });
  });

  describe('Restore Functionality', () => {
    it('calls restore mutation when Recover button is clicked for dish', async () => {
      const user = userEvent.setup();
      const mockUpdate = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn((table: string) => {
        if (table === 'Dishes') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockDishes, error: null })),
              })),
            })),
            update: vi.fn(() => ({
              eq: mockUpdate,
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        };
      });

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });

      const recoverButtons = screen.getAllByText('Recover');
      await user.click(recoverButtons[0]);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
      });
    });

    it('calls restore mutation when Recover button is clicked for menu', async () => {
      const user = userEvent.setup();
      const mockUpdate = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn((table: string) => {
        if (table === 'MenuDays') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockMenus, error: null })),
              })),
            })),
            update: vi.fn(() => ({
              eq: mockUpdate,
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
          })),
        };
      });

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Wednesday/)).toBeInTheDocument();
      });

      const recoverButtons = screen.getAllByText('Recover');
      await user.click(recoverButtons[0]);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Hard Delete Functionality', () => {
    it('shows confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'MenuDays' ? mockMenus : [],
                error: null,
              })
            ),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Wednesday/)).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Permanently delete menu');
      await user.click(deleteButtons[0]);

      expect(mockConfirm).toHaveBeenCalledWith(
        'Permanently delete this menu? This cannot be undone.'
      );
    });

    it('does not delete when user cancels confirmation', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(false);
      const mockDelete = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'MenuDays' ? mockMenus : [],
                error: null,
              })
            ),
          })),
        })),
        delete: vi.fn(() => ({
          eq: mockDelete,
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Wednesday/)).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Permanently delete menu');
      await user.click(deleteButtons[0]);

      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('shows alert when foreign key constraint prevents deletion', async () => {
      const user = userEvent.setup();
      const fkError = {
        code: '23503',
        message: 'Foreign key violation',
      };
      const mockFrom = vi.fn((table: string) => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() =>
              Promise.resolve({
                data: table === 'MenuDays' ? mockMenus : [],
                error: null,
              })
            ),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: fkError })),
        })),
      }));

      (supabase.from as any) = mockFrom;

      render(<TrashBin />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Wednesday/)).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Permanently delete menu');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          expect.stringContaining('cannot be deleted because there are related orders')
        );
      });
    });
  });
});