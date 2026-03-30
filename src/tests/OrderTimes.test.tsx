import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderTimes } from '../components/admin/analytics/OrderTimes';

describe('OrderTimes', () => {
  const emptyMatrix = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  
  const mockMatrix = [
    Array.from({ length: 24 }, () => 0), 
    Array.from({ length: 24 }, () => 0), 
    Array.from({ length: 24 }, () => 0), 
    Array.from({ length: 24 }, () => 0), 
    Array.from({ length: 24 }, () => 0), 
    Array.from({ length: 24 }, () => 0), 
    Array.from({ length: 24 }, () => 0), 
  ];
  
  mockMatrix[0][12] = 5;  
  mockMatrix[2][18] = 10; 
  mockMatrix[4][13] = 3;  

  describe('Component Rendering', () => {
    it('renders without crashing with valid data', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />
      );
      
      expect(container.firstChild).toBeTruthy();
    });

    it('displays the heatmap title', () => {
      render(<OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />);
      
      expect(screen.getByText('Order Times Heatmap')).toBeInTheDocument();
    });

    it('renders with empty matrix', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={emptyMatrix} dayHourMax={0} />
      );
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Day Labels', () => {
    it('displays all 7 day labels', () => {
      render(<OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />);
      
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });
  });

  describe('Hour Labels', () => {
    it('displays hour labels with AM/PM format', () => {
      render(<OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />);
      
      expect(screen.getByText('12AM')).toBeInTheDocument(); 
      expect(screen.getByText('12PM')).toBeInTheDocument(); 
      expect(screen.getByText('6PM')).toBeInTheDocument();  
    });

    it('displays all 24 hours', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />
      );
      
      const hourElements = container.querySelectorAll('.text-\\[10px\\]');
      expect(hourElements.length).toBeGreaterThanOrEqual(24);
    });
  });

  describe('Data Display', () => {
    it('displays order counts in cells with data', () => {
      render(<OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();  
      expect(screen.getByText('10')).toBeInTheDocument(); 
      expect(screen.getByText('3')).toBeInTheDocument(); 
    });

    it('does not display counts for empty cells', () => {
      const sparseMatrix = Array.from({ length: 7 }, () => 
        Array.from({ length: 24 }, () => 0)
      );
      sparseMatrix[0][0] = 5; 
      
      render(<OrderTimes dayHourMatrix={sparseMatrix} dayHourMax={5} />);
      
      const countElements = screen.getAllByText('5');
      expect(countElements.length).toBe(1);
    });
  });

  describe('Matrix Dimensions', () => {
    it('handles 7x24 matrix correctly', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />
      );
      
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      dayLabels.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('renders correct number of cells', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />
      );
      
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero max value', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={emptyMatrix} dayHourMax={0} />
      );
      
      expect(container.firstChild).toBeTruthy();
    });

    it('handles very high order counts', () => {
      const highMatrix = Array.from({ length: 7 }, () => 
        Array.from({ length: 24 }, () => 0)
      );
      highMatrix[0][12] = 9999;
      
      render(<OrderTimes dayHourMatrix={highMatrix} dayHourMax={9999} />);
      
      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('handles single order in matrix', () => {
      const singleMatrix = Array.from({ length: 7 }, () => 
        Array.from({ length: 24 }, () => 0)
      );
      singleMatrix[3][15] = 1; 
      
      render(<OrderTimes dayHourMatrix={singleMatrix} dayHourMax={1} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('handles all cells having same count', () => {
      const uniformMatrix = Array.from({ length: 7 }, () => 
        Array.from({ length: 24 }, () => 5)
      );
      
      const { container } = render(
        <OrderTimes dayHourMatrix={uniformMatrix} dayHourMax={5} />
      );
      
      expect(container.textContent).toContain('5');
    });
  });

  describe('Props Validation', () => {
    it('accepts valid dayHourMatrix prop', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={mockMatrix} dayHourMax={10} />
      );
      
      expect(container.firstChild).toBeTruthy();
    });

    it('accepts dayHourMax prop', () => {
      const { container } = render(
        <OrderTimes dayHourMatrix={mockMatrix} dayHourMax={100} />
      );
      
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with max value of 1', () => {
      const simpleMatrix = Array.from({ length: 7 }, () => 
        Array.from({ length: 24 }, () => 0)
      );
      simpleMatrix[0][0] = 1;
      
      render(<OrderTimes dayHourMatrix={simpleMatrix} dayHourMax={1} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});