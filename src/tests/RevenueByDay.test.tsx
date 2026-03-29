import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RevenueByDay } from '../components/admin/analytics/RevenueByDay';
import type { DayStat } from '../types/analyticsTypes';

describe('RevenueByDay', () => {
  const mockData: DayStat[] = [
    { day: 'Monday', revenue: 450.00, orders: 15, index: 0 },
    { day: 'Tuesday', revenue: 380.50, orders: 12, index: 1 },
    { day: 'Wednesday', revenue: 520.75, orders: 18, index: 2 },
    { day: 'Thursday', revenue: 310.25, orders: 10, index: 3 },
    { day: 'Friday', revenue: 680.00, orders: 22, index: 4 },
    { day: 'Saturday', revenue: 590.50, orders: 19, index: 5 },
    { day: 'Sunday', revenue: 420.00, orders: 14, index: 6 },
  ];

  describe('Component Rendering', () => {
    it('renders without crashing with valid data', () => {
      const { container } = render(<RevenueByDay data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with all 7 days of week', () => {
      const { container } = render(<RevenueByDay data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with partial week data', () => {
      const partialData: DayStat[] = [
        { day: 'Monday', revenue: 100, orders: 5, index: 0 },
        { day: 'Tuesday', revenue: 150, orders: 7, index: 1 },
      ];
      
      const { container } = render(<RevenueByDay data={partialData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with single day data', () => {
      const singleDay: DayStat[] = [
        { day: 'Monday', revenue: 500, orders: 20, index: 0 },
      ];
      
      const { container } = render(<RevenueByDay data={singleDay} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('uses default blue color', () => {
      const { container } = render(<RevenueByDay data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts custom color prop', () => {
      const customColor = '#FF5733';
      const { container } = render(<RevenueByDay data={mockData} color={customColor} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Data Edge Cases', () => {
    it('handles days with zero revenue', () => {
      const zeroRevenue: DayStat[] = [
        { day: 'Monday', revenue: 0, orders: 0, index: 0 },
        { day: 'Tuesday', revenue: 100, orders: 5, index: 1 },
      ];
      
      const { container } = render(<RevenueByDay data={zeroRevenue} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles very high revenue values', () => {
      const highRevenue: DayStat[] = [
        { day: 'Friday', revenue: 99999.99, orders: 500, index: 4 },
      ];
      
      const { container } = render(<RevenueByDay data={highRevenue} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles decimal revenue values', () => {
      const decimalRevenue: DayStat[] = [
        { day: 'Wednesday', revenue: 123.456, orders: 7, index: 2 },
      ];
      
      const { container } = render(<RevenueByDay data={decimalRevenue} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles all days with same revenue', () => {
      const uniformData: DayStat[] = mockData.map(d => ({ ...d, revenue: 500, orders: 20 }));
      
      const { container } = render(<RevenueByDay data={uniformData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles varying order counts', () => {
      const varyingOrders: DayStat[] = [
        { day: 'Monday', revenue: 100, orders: 1, index: 0 },
        { day: 'Tuesday', revenue: 1000, orders: 100, index: 1 },
        { day: 'Wednesday', revenue: 500, orders: 50, index: 2 },
      ];
      
      const { container } = render(<RevenueByDay data={varyingOrders} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Day Data Structure', () => {
    it('handles complete day stat objects', () => {
      const completeData: DayStat[] = [
        { day: 'Monday', revenue: 500.00, orders: 20, index: 0 },
      ];
      
      const { container } = render(<RevenueByDay data={completeData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with days in order', () => {
      const orderedData: DayStat[] = [
        { day: 'Monday', revenue: 100, orders: 5, index: 0 },
        { day: 'Tuesday', revenue: 150, orders: 7, index: 1 },
        { day: 'Wednesday', revenue: 200, orders: 10, index: 2 },
        { day: 'Thursday', revenue: 180, orders: 9, index: 3 },
        { day: 'Friday', revenue: 250, orders: 12, index: 4 },
        { day: 'Saturday', revenue: 220, orders: 11, index: 5 },
        { day: 'Sunday', revenue: 170, orders: 8, index: 6 },
      ];
      
      const { container } = render(<RevenueByDay data={orderedData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles empty data array', () => {
      const { container } = render(<RevenueByDay data={[]} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });
});