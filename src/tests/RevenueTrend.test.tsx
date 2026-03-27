import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevenueTrend } from '../components/admin/analytics/RevenueTrend';
import type { TrendStat } from '../types/analyticsTypes';

describe('RevenueTrend', () => {
  const mockData: TrendStat[] = [
    { date: '2024-03-20', revenue: 450.00, orders: 15, aov: 30.00 },
    { date: '2024-03-21', revenue: 380.50, orders: 12, aov: 31.71 },
    { date: '2024-03-22', revenue: 520.75, orders: 18, aov: 28.93 },
  ];

  describe('Empty State Handling', () => {
    it('displays empty message when no data provided', () => {
      render(<RevenueTrend data={[]} />);
      
      expect(screen.getByText('Not enough data for trend analysis')).toBeInTheDocument();
    });

    it('handles null data gracefully', () => {
      render(<RevenueTrend data={null as any} />);
      
      expect(screen.getByText('Not enough data for trend analysis')).toBeInTheDocument();
    });

    it('handles undefined data gracefully', () => {
      render(<RevenueTrend data={undefined as any} />);
      
      expect(screen.getByText('Not enough data for trend analysis')).toBeInTheDocument();
    });

    it('does not render chart when data is empty', () => {
      const { container } = render(<RevenueTrend data={[]} />);
      
      const chart = container.querySelector('.recharts-wrapper');
      expect(chart).not.toBeInTheDocument();
    });
  });

  describe('Component Rendering with Data', () => {
    it('renders without crashing when data is provided', () => {
      const { container } = render(<RevenueTrend data={mockData} />);
      
      expect(screen.queryByText('Not enough data for trend analysis')).not.toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts single day data', () => {
      const singleDay: TrendStat[] = [
        { date: '2024-03-20', revenue: 100.00, orders: 5, aov: 20.00 },
      ];
      
      const { container } = render(<RevenueTrend data={singleDay} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with multiple days of data', () => {
      const { container } = render(<RevenueTrend data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('uses default purple color', () => {
      const { container } = render(<RevenueTrend data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts custom color prop', () => {
      const customColor = '#FF5733';
      const { container } = render(<RevenueTrend data={mockData} color={customColor} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Data Edge Cases', () => {
    it('handles zero revenue days', () => {
      const zeroRevenue: TrendStat[] = [
        { date: '2024-03-20', revenue: 0, orders: 0, aov: 0 },
      ];
      
      const { container } = render(<RevenueTrend data={zeroRevenue} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles very high revenue', () => {
      const highRevenue: TrendStat[] = [
        { date: '2024-03-20', revenue: 99999.99, orders: 500, aov: 199.99 },
      ];
      
      const { container } = render(<RevenueTrend data={highRevenue} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles decimal revenue values', () => {
      const decimalRevenue: TrendStat[] = [
        { date: '2024-03-20', revenue: 123.456, orders: 5, aov: 24.69 },
      ];
      
      const { container } = render(<RevenueTrend data={decimalRevenue} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles sequential dates', () => {
      const sequentialData: TrendStat[] = [
        { date: '2024-03-20', revenue: 100, orders: 5, aov: 20 },
        { date: '2024-03-21', revenue: 150, orders: 7, aov: 21.43 },
        { date: '2024-03-22', revenue: 200, orders: 10, aov: 20 },
      ];
      
      const { container } = render(<RevenueTrend data={sequentialData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles non-sequential dates', () => {
      const nonSequentialData: TrendStat[] = [
        { date: '2024-03-20', revenue: 100, orders: 5, aov: 20 },
        { date: '2024-03-25', revenue: 150, orders: 7, aov: 21.43 },
        { date: '2024-03-30', revenue: 200, orders: 10, aov: 20 },
      ];
      
      const { container } = render(<RevenueTrend data={nonSequentialData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Data Structure', () => {
    it('handles complete trend stat objects', () => {
      const completeData: TrendStat[] = [
        { date: '2024-03-20', revenue: 500.00, orders: 20, aov: 25.00 },
      ];
      
      const { container } = render(<RevenueTrend data={completeData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with varying AOV values', () => {
      const varyingAOV: TrendStat[] = [
        { date: '2024-03-20', revenue: 100, orders: 10, aov: 10 },
        { date: '2024-03-21', revenue: 500, orders: 5, aov: 100 },
        { date: '2024-03-22', revenue: 300, orders: 15, aov: 20 },
      ];
      
      const { container } = render(<RevenueTrend data={varyingAOV} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles many data points', () => {
      const manyDays: TrendStat[] = Array.from({ length: 30 }, (_, i) => ({
        date: `2024-03-${String(i + 1).padStart(2, '0')}`,
        revenue: Math.random() * 1000,
        orders: Math.floor(Math.random() * 50),
        aov: Math.random() * 50,
      }));
      
      const { container } = render(<RevenueTrend data={manyDays} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });
});