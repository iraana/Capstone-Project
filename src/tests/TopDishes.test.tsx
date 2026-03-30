import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopDishes } from '../components/admin/analytics/TopDishes';
import type { DishStat } from '../types/analyticsTypes';

describe('TopDishes', () => {
  const mockData: DishStat[] = [
    { name: 'Pasta Carbonara', quantity: 25, revenue: 249.75 },
    { name: 'Caesar Salad', quantity: 18, revenue: 143.82 },
    { name: 'Grilled Chicken', quantity: 15, revenue: 224.85 },
  ];
 
  describe('Empty State Handling', () => {
    it('displays default empty message when no data provided', () => {
      render(<TopDishes data={[]} />);
      
      expect(screen.getByText('Not enough data to display')).toBeInTheDocument();
    });
 
    it('displays custom empty message when provided', () => {
      const customMessage = 'No dishes available yet';
      render(<TopDishes data={[]} emptyMessage={customMessage} />);
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
 
    it('shows empty state for null data', () => {
      render(<TopDishes data={null as any} />);
      
      expect(screen.getByText('Not enough data to display')).toBeInTheDocument();
    });
 
    it('shows empty state for undefined data', () => {
      render(<TopDishes data={undefined as any} />);
      
      expect(screen.getByText('Not enough data to display')).toBeInTheDocument();
    });
  });
 
  describe('Component Rendering with Data', () => {
    it('renders without crashing when data is provided', () => {
      const { container } = render(<TopDishes data={mockData} />);
      
      
      expect(screen.queryByText('Not enough data to display')).not.toBeInTheDocument();
      
      
      expect(container.firstChild).toBeTruthy();
    });
 
    it('accepts single dish data', () => {
      const singleDish: DishStat[] = [
        { name: 'Solo Dish', quantity: 5, revenue: 50 },
      ];
      
      const { container } = render(<TopDishes data={singleDish} />);
      
      expect(screen.queryByText('Not enough data to display')).not.toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });
 
    it('accepts data with different quantities', () => {
      const variedData: DishStat[] = [
        { name: 'Popular Dish', quantity: 100, revenue: 1000 },
        { name: 'Rare Dish', quantity: 1, revenue: 10 },
      ];
      
      const { container } = render(<TopDishes data={variedData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });
 
  describe('Props Handling', () => {
    it('accepts custom xKey prop', () => {
      const customData = [
        { dishName: 'Pizza', quantity: 10, revenue: 100 },
      ];
      
      const { container } = render(
        <TopDishes data={customData as any} xKey="dishName" />
      );
      
     
      expect(container.firstChild).toBeTruthy();
    });
 
    it('accepts custom yKey prop', () => {
      const { container } = render(
        <TopDishes data={mockData} yKey="revenue" />
      );
      
      
      expect(container.firstChild).toBeTruthy();
    });
 
    it('accepts custom color prop', () => {
      const customColor = '#FF5733';
      const { container } = render(
        <TopDishes data={mockData} color={customColor} />
      );
      
      
      expect(container.firstChild).toBeTruthy();
    });
  });
 
  describe('Data Edge Cases', () => {
    it('handles dishes with zero quantity', () => {
      const zeroData: DishStat[] = [
        { name: 'Not Sold', quantity: 0, revenue: 0 },
      ];
      
      const { container } = render(<TopDishes data={zeroData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
 
    it('handles dishes with very high quantities', () => {
      const highData: DishStat[] = [
        { name: 'Super Popular', quantity: 99999, revenue: 999999 },
      ];
      
      const { container } = render(<TopDishes data={highData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
 
    it('handles dishes with decimal revenue', () => {
      const decimalData: DishStat[] = [
        { name: 'Precise Dish', quantity: 5, revenue: 123.456789 },
      ];
      
      const { container } = render(<TopDishes data={decimalData} />);
      
      expect(container.firstChild).toBeTruthy();
    });
  });
});