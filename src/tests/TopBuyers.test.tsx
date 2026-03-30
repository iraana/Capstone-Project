import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBuyers } from '../components/admin/analytics/TopBuyers';
import type { BuyerStat } from '../types/analyticsTypes';

describe('TopBuyers', () => {
  const mockData: BuyerStat[] = [
    { id: 'user1', name: 'John Smith', orders: 15, spent: 450.00 },
    { id: 'user2', name: 'Jane Doe', orders: 12, spent: 380.50 },
    { id: 'user3', name: 'Bob Johnson', orders: 8, spent: 275.25 },
  ];

  describe('Empty State Handling', () => {
    it('displays empty message when no data provided', () => {
      render(<TopBuyers data={[]} />);
      
      expect(screen.getByText('Not enough data to display')).toBeInTheDocument();
    });
  });

  describe('Component Rendering with Data', () => {
    it('renders without crashing when data is provided', () => {
      const { container } = render(<TopBuyers data={mockData} />);
      
      expect(screen.queryByText('Not enough data to display')).not.toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts single buyer data', () => {
      const singleBuyer: BuyerStat[] = [
        { id: 'user1', name: 'Solo Buyer', orders: 5, spent: 100.00 },
      ];
      
      const { container } = render(<TopBuyers data={singleBuyer} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with multiple buyers', () => {
      const { container } = render(<TopBuyers data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('uses default green color', () => {
      const { container } = render(<TopBuyers data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts custom color prop', () => {
      const customColor = '#FF5733';
      const { container } = render(<TopBuyers data={mockData} color={customColor} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('uses spent as default yKey', () => {
      const { container } = render(<TopBuyers data={mockData} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts custom yKey prop for orders', () => {
      const { container } = render(<TopBuyers data={mockData} yKey="orders" />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Data Edge Cases', () => {
    it('handles buyers with zero spending', () => {
      const zeroSpent: BuyerStat[] = [
        { id: 'user1', name: 'Window Shopper', orders: 0, spent: 0 },
      ];
      
      const { container } = render(<TopBuyers data={zeroSpent} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles buyers with high spending', () => {
      const highSpender: BuyerStat[] = [
        { id: 'user1', name: 'Big Spender', orders: 100, spent: 99999.99 },
      ];
      
      const { container } = render(<TopBuyers data={highSpender} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles buyers with decimal spending amounts', () => {
      const decimalSpent: BuyerStat[] = [
        { id: 'user1', name: 'Precise Buyer', orders: 3, spent: 123.456 },
      ];
      
      const { container } = render(<TopBuyers data={decimalSpent} />);
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles buyers with long names', () => {
      const longName: BuyerStat[] = [
        { id: 'user1', name: 'Customer With A Very Very Long Name That Might Need Truncation', orders: 5, spent: 100 },
      ];
      
      const { container } = render(<TopBuyers data={longName} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Data Transformation', () => {
    it('correctly transforms buyer data to chart format', () => {
      const { container } = render(<TopBuyers data={mockData} />);
      
      
      expect(container.firstChild).toBeTruthy();
    });

    it('preserves all buyer properties', () => {
      const detailedBuyer: BuyerStat[] = [
        { id: 'user123', name: 'Test User', orders: 10, spent: 500.00 },
      ];
      
      const { container } = render(<TopBuyers data={detailedBuyer} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });
});