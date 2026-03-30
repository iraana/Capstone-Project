import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Analytics } from '../components/admin/analytics/Analytics';
import * as useAnalyticsDataModule from '../hooks/useAnalyticsData';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  Variants: {} as any,
}));

// Mock the lazy-loaded components
vi.mock('../components/admin/analytics/TopDishes', () => ({
  TopDishes: () => <div data-testid="top-dishes-chart">Top Dishes Chart</div>,
}));

vi.mock('../components/admin/analytics/TopBuyers', () => ({
  TopBuyers: () => <div data-testid="top-buyers-chart">Top Buyers Chart</div>,
}));

vi.mock('../components/admin/analytics/OrderTimes', () => ({
  OrderTimes: () => <div data-testid="order-times-chart">Order Times Chart</div>,
}));

vi.mock('../components/admin/analytics/RevenueTrend', () => ({
  RevenueTrend: () => <div data-testid="revenue-trend-chart">Revenue Trend Chart</div>,
}));

vi.mock('../components/admin/analytics/RevenueByDay', () => ({
  RevenueByDay: () => <div data-testid="revenue-by-day-chart">Revenue By Day Chart</div>,
}));

describe('Analytics', () => {
  const mockAnalyticsData = {
    dishStats: [
      { name: 'Pasta', quantity: 25, revenue: 250 },
      { name: 'Salad', quantity: 15, revenue: 150 },
    ],
    buyerStats: [
      { id: '1', name: 'John Doe', orders: 10, spent: 500 },
    ],
    buyerStatsByOrders: [
      { id: '1', name: 'John Doe', orders: 10, spent: 500 },
    ],
    timeStats: [
      { hourLabel: '12 PM', count: 5, hour: 12 },
    ],
    trendStats: [
      { date: '2024-03-20', revenue: 1000, orders: 20, aov: 50 },
    ],
    dayStats: [
      { day: 'Monday', revenue: 500, orders: 10, index: 0 },
      { day: 'Tuesday', revenue: 300, orders: 6, index: 1 },
    ],
    kpis: {
      totalRevenue: 5000,
      aov: 50,
      repeatCustomerRate: 25,
      avgBasketSize: 3.5,
      avgTime: '12:30 PM',
      peakTime: '6:00 PM',
      topDish: { name: 'Pasta', quantity: 25, revenue: 250 },
      topBuyer: { id: '1', name: 'John Doe', orders: 10, spent: 500 },
    },
    dayHourMatrix: Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0)),
    dayHourMax: 10,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading and Error States', () => {
   it('displays loader when data is loading', () => {
  vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue({
    ...mockAnalyticsData,
    isLoading: true,
  });

  const { container } = render(<Analytics />);

  expect(container.querySelector('.lucide-loader-circle')).toBeInTheDocument();
});

    it('displays error message when there is an error', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue({
        ...mockAnalyticsData,
        isLoading: false,
        error: new Error('Failed to load analytics'),
      });

      render(<Analytics />);

      expect(screen.getByText(/error loading analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to load analytics/i)).toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    it('renders without crashing with valid data', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      const { container } = render(<Analytics />);

      expect(container.firstChild).toBeTruthy();
    });

    it('displays the Analytics heading', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('displays BI description text', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      expect(screen.getByText(/BI for dish, menu, order, and customer data/i)).toBeInTheDocument();
    });
  });

  describe('KPIs Display', () => {
    it('displays all KPI cards when data is available', () => {
  vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

  render(<Analytics />);

  expect(screen.getAllByText('Gross Revenue').length).toBeGreaterThan(0);
  expect(screen.getByText('$5000.00')).toBeInTheDocument();
  expect(screen.getByText('Retention Rate')).toBeInTheDocument();
  expect(screen.getByText('25.0%')).toBeInTheDocument();
  expect(screen.getByText('Avg Basket')).toBeInTheDocument();
  expect(screen.getByText('3.5')).toBeInTheDocument();
});

it('displays average order time KPI', () => {
  vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

  render(<Analytics />);

  expect(screen.getByText('Avg Order Time')).toBeInTheDocument();
  expect(screen.getByText('12:30 PM')).toBeInTheDocument();
  expect(screen.getByText(/Peak: 6:00 PM/i)).toBeInTheDocument();
});

it('does not display KPIs when kpis is null', () => {
  vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue({
    ...mockAnalyticsData,
    kpis: null,
  });

  render(<Analytics />);

  expect(screen.queryByText('Retention Rate')).not.toBeInTheDocument();
});
});

  describe('Tab Navigation', () => {
    it('displays all tab buttons', async () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText('Trend')).toBeInTheDocument();
        expect(screen.getByText('Menu Days')).toBeInTheDocument();
        expect(screen.getByText('Highest')).toBeInTheDocument();
        expect(screen.getByText('Lowest')).toBeInTheDocument();
      });
    });

    it('renders default chart (revenue trend)', async () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByTestId('revenue-trend-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Data Table', () => {
    it('displays detailed data report section', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      expect(screen.getByText('Detailed Data Report')).toBeInTheDocument();
    });

    it('displays export CSV button', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      expect(screen.getByText('Export to CSV')).toBeInTheDocument();
    });

    it('displays table with data', async () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue(mockAnalyticsData);

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText('Date')).toBeInTheDocument();
      });
    });
  });

  describe('Empty Data Handling', () => {
    it('handles empty chart data gracefully', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue({
        ...mockAnalyticsData,
        trendStats: [],
        dishStats: [],
        buyerStats: [],
      });

      const { container } = render(<Analytics />);

      expect(container.firstChild).toBeTruthy();
    });

    it('displays empty state message in table when no data', () => {
      vi.spyOn(useAnalyticsDataModule, 'useAnalyticsData').mockReturnValue({
        ...mockAnalyticsData,
        trendStats: [],
      });

      render(<Analytics />);

      expect(screen.getByText(/no data available for this selection/i)).toBeInTheDocument();
    });
  });
});
